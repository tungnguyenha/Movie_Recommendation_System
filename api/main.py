import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import ast
from flask import Flask,render_template,request,redirect,jsonify
from flask_cors import CORS
import pickle
import pyodbc
import random
import requests
import bs4
from bs4 import BeautifulSoup
import math
import os
import cv2
import shutil
from ultralytics import YOLO
class CF(object):
    """docstring for CF"""
    def __init__(self, Y_data, k, dist_func = cosine_similarity, uuCF = 1):
        self.uuCF = uuCF # user-user (1) or item-item (0) CF
        self.Y_data = Y_data if uuCF else Y_data[:, [1, 0, 2]]
        self.k = k
        self.dist_func = dist_func # đánh giá độ tương quan giữ 2 user
        self.Ybar_data = None # bản sao của ydata dùng để lưu ma trận nornalize
        # number of users and items. Remember to add 1 since id starts from 0
        self.n_users = int(np.max(self.Y_data[:, 0])) + 1 # số lượng User
        self.n_items = int(np.max(self.Y_data[:, 1])) + 1 # số lượng Item
    
    def add(self, new_data):
        """
        Update Y_data matrix when new ratings come.
        For simplicity, suppose that there is no new user or item.
        """
        self.Y_data = np.concatenate((self.Y_data, new_data), axis = 0)

    def normalize_Y(self):
        users = self.Y_data[:, 0] # all users - first col of the Y_data
        self.Ybar_data = self.Y_data.copy()
        self.mu = np.zeros((self.n_users,)) # lư

        for n in range(self.n_users):
            # row indices of rating done by user n
            # since indices need to be integers, we need to convert
            ids = np.where(users == n)[0].astype(np.int32)
            # indices of all ratings associated with user n
            item_ids = self.Y_data[ids, 1]
            # and the corresponding ratings
            ratings = self.Y_data[ids, 2]
            # take mean
            m = np.mean(ratings)
            if np.isnan(m):
                m = 0 # to avoid empty array and nan value
            self.mu[n] = m
            # normalize
            self.Ybar_data[ids, 2] = ratings - self.mu[n] + 0.01
        self.Ybar = sparse.coo_matrix((self.Ybar_data[:, 2],
            (self.Ybar_data[:, 1], self.Ybar_data[:, 0])), (self.n_items, self.n_users))

        self.Ybar = self.Ybar.tocsr()

    def similarity(self):
        eps = 1e-6
        self.S = self.dist_func(self.Ybar.T, self.Ybar.T)

    def refresh(self):
        """
        Normalize data and calculate similarity matrix again (after
        some few ratings added)
        """
        self.normalize_Y()
        self.similarity()


    def fit(self):
        self.refresh()


    def __pred(self, u, i, normalized = 1):
        """
        predict the rating of user u for item i (normalized)
        if you need the un
        """
        # Step 1: find all users who rated i
        ids = np.where(self.Y_data[:, 1] == i)[0].astype(np.int32) # vi tri user danh gia item
        # Step 2:
        users_rated_i = (self.Y_data[ids, 0]).astype(np.int32)
        # Step 3: find similarity btw the current user and others
        # who already rated i
       
        if len(users_rated_i) != 0:
          sim = self.S[u, users_rated_i] # matran similarity
          sim = sim + 0.01
          # Step 4: find the k most similarity users
          a = np.argsort(sim)[-self.k:]
          c = users_rated_i[a]
          # and the corresponding similarity levels
          nearest_s = sim[a]
          #print('users_rated_i[a]',users_rated_i[a])
          # How did each of 'near' users rated item i
          r = self.Ybar[i, users_rated_i[a]]
          if normalized:
              # add a small number, for instance, 1e-8, to avoid dividing by 0
              Z = (r*nearest_s)[0]/(np.abs(nearest_s).sum() + 1e-8)
              return Z,c
          return Z,c
        else:
          return 0,0

    def pred(self, u, i, normalized = 1):
        """
        predict the rating of user u for item i (normalized)
        if you need the un
        """
        if self.uuCF: return self.__pred(u, i, normalized)
        return self.__pred(i, u, normalized)


    def recommend(self, u):
        """
        Determine all items should be recommended for user u.
        The decision is made based on all i such that:
        self.pred(u, i) > 0. Suppose we are considering items which
        have not been rated by u yet.
        """
        ids = np.where(self.Y_data[:, 0] == u)[0]
        items_rated_by_u = self.Y_data[ids, 1].tolist()
        recommended_items = []
        for i in range(self.n_items):
            if i not in items_rated_by_u:
                rating,c = self.__pred(u, i)
                if rating > 0:
                    recommended_items.append([rating,i,c])
        sorted_list = sorted(recommended_items, reverse=True)
        four_lines = sorted_list[:20]
        arr1 = []
        arr2 = []
        for i in four_lines:
          arr1.append(i[1])
          arr2.append(i[2])
        #four_lines_last_column = [row[-1] for row in four_lines]
        return arr1,arr2

import joblib

conn = pyodbc.connect(driver= '{ODBC Driver 17 for SQL Server}',\
    host ='LAPTOP-48QSU778\SQLEXPRESS',database ='Movie_DB',\
    UID='quy123',PWD='123',trusted_connection='yes')

app = Flask(__name__)

CORS(app)

@app.route("/train-model")
def trainmodels():
    train = []
    cursor = conn.cursor()
    cursor.execute("select User_ID,Movie_ID,Rating from tbl_rating")
    for row in cursor:
        data = [row[0],row[1],row[2]]
        train.append(data)
    train = np.array(train)
    
    rs = CF(train, k = 5, uuCF = 1)
    rs.fit()
    os.remove("model-rcm.pkl")
    pickle.dump(rs,open('model-rcm.pkl','wb'))
    reponse = {
        "responseCode": 200
    }
    print('Da train xong')
    return jsonify(reponse)

@app.route("/recommend")
def member():
    loaded_model = joblib.load('model-rcm.pkl')
    memberId = request.args.get('id')
    id = int(memberId)
    movieListId,userListId = loaded_model.recommend(id)
    return movieListId

@app.route("/add-rating", methods=["POST"])
def addRating():
    loaded_model = joblib.load('model-rcm.pkl')
    data = request.get_json()
    rating = data.get('data')
    if not rating:
        return jsonify({"error": "json not provided"}), 400

    newData = np.array([rating])
    loaded_model.add(newData)
    pickle.dump(loaded_model,open('model-rcm.pkl','wb'))
    reponse = {
        "data": data
    }
    return jsonify(reponse)  

@app.route("/add-rating-list", methods=["POST"])
def addRatingList():
    loaded_model = joblib.load('model-rcm.pkl')
    data = request.get_json()
    userId = data.get('userId')
    list_movieId = data.get('listMovieId')
    
    if not userId or not list_movieId:
        return jsonify({"error": "json not provided"}), 400
    for movie_id in list_movieId:
        newData = np.array([[userId,movie_id,5]])
        loaded_model.add(newData)
    pickle.dump(loaded_model,open('model-rcm.pkl','wb'))
    reponse = {
        "data": data
    }
    return jsonify(reponse)  

model_path = "model_detect.pt"

output_video_folder = r"D:\NodeJS\DATN_Rcm_Movie\client\public"
output_poster_folder = r"D:\NodeJS\DATN_Rcm_Movie\client\public"

model = YOLO(model_path)

def predict_and_plot(image, model):
    results = model(image)
    rate = [result.conf.item() for result in results[0].boxes]
    detect_img = results[0].plot()
    highest_rate = max(rate) if rate else 0.0
    return detect_img, highest_rate

def prepare_output_folder(output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    else:
        shutil.rmtree(output_folder)
        os.makedirs(output_folder)

@app.route("/detect_ninedashline_poster", methods=['POST'])
def detect_poster():
    data = request.get_json()
    poster_url = data.get('url')
    print(poster_url)
    if not poster_url:
        return jsonify({"error": "URL not provided"}), 400

    prepare_output_folder(output_poster_folder)

    poster_predicted, rate = predict_and_plot(poster_url, model)

    if rate * 100 > 60.0:
        poster_filename = os.path.join(output_poster_folder, "poster.png")
        cv2.imwrite(poster_filename, poster_predicted)
        response_data = {
            "safe": 1,
            "image_list": [poster_filename],
        }
    else:
        response_data = {
            "safe": 0,
            "image_list": [],
        }

    return jsonify(response_data)

@app.route("/detect_ninedashline_video", methods=['POST'])
def detect_video():
    data = request.get_json()
    video_url = data.get('url')

    if not video_url:
        return jsonify({"error": "URL not provided"}), 400

    prepare_output_folder(output_video_folder)

    cap = cv2.VideoCapture(video_url)
    if not cap.isOpened():
        return jsonify({"error": "Cannot open video."}), 400

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        return jsonify({"error": "Cannot retrieve FPS from video."}), 400

    print(f"FPS: {fps}")

    image_list = []
    second_list = []
    safe = 0
    second_index = 0

    while True:
        frame_position = int(second_index * fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_position)
        ret, frame = cap.read()
        if not ret:
            break

        frame, rate = predict_and_plot(frame, model)
        timestamp = frame_position / fps

        if rate * 100 > 60.0:
            frame_filename = os.path.join(output_video_folder, f"frame_{second_index:04d}_{timestamp:.2f}s.png")
            image_list.append(frame_filename)
            second_list.append(timestamp)
            safe = 1
            cv2.imwrite(frame_filename, frame)

        second_index += 1

    cap.release()
    print(f"Extracted {second_index} frames to {output_video_folder}")

    response = {
        "safe": safe,
        "image_list": image_list,
        "second_list": second_list
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)