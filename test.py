import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import ast
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
            self.Ybar_data[ids, 2] = ratings - self.mu[n]
        self.Ybar = sparse.coo_matrix((self.Ybar_data[:, 2],
            (self.Ybar_data[:, 1], self.Ybar_data[:, 0])), (self.n_items, self.n_users))

        self.Ybar = self.Ybar.tocsr()

    def similarity(self):
        eps = 1e-6
        self.S = self.dist_func(self.Ybar.T, self.Ybar.T)

    def refresh(self):
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
        sim = self.S[u, users_rated_i] # matran similarity
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
        #four_lines= np.array(four_lines)
        #four_lines_last_column = [row[-1] for row in four_lines]
        return arr1,arr2

from flask import Flask,render_template,request,redirect
import pickle
import pyodbc
import random
import requests
import bs4
from bs4 import BeautifulSoup
import math
from flask_cors import CORS
import os
with open("model.pkl", "rb") as f:
    model = pickle.load(f)
    
app = Flask(__name__)

CORS(app)

conn = pyodbc.connect(driver= '{ODBC Driver 17 for SQL Server}',\
    host ='LAPTOP-48QSU778\SQLEXPRESS',database ='TestDB',\
    UID='quy123',PWD='123',trusted_connection='yes')

# interface
@app.route('/')
def index():
    return render_template('index.html')

# Log out 
@app.route('/logout',methods=['post'])
def logout():
    return render_template('index.html')

@app.route('/xoaphim',methods=['post'])
def xoaphim():
    id_movie = request.form.get('id_movie')
    author = request.form.get('author')
    country = request.form.get('country')
    with open("./templates/admin.html",encoding="utf-8") as fp:
            soup1 = bs4.BeautifulSoup(fp.read(), "html.parser")
    h1_tag = soup1.find(class_='box2')
    span_tag = soup1.find(class_='action_name')  
    h1_tag['style'] = 'display:block'
    try:
        cursor = conn.cursor()
        query = "DELETE FROM Rating WHERE Movie_Id = {}".format(int(id_movie))
        cursor.execute(query)
        cursor.execute("DELETE FROM Movie WHERE Movie_Id = {} OR Director = '{}' OR Country = '{}'".format(int(id_movie), author, country))
        rows_deleted = cursor.rowcount
        if rows_deleted ==0:
            span_tag.string.replace_with("Xoá thất bại")
        else:
            span_tag.string.replace_with("Xoá thành công")
        conn.commit()
    except pyodbc.Error as e:
        span_tag.string.replace_with("Xoá thất bại")
    return soup1.prettify() 

# Xoa User
@app.route('/xoauser',methods=['post'])
def xoauser():
    id_user = request.form.get('id_user')
    with open("./templates/admin.html",encoding="utf-8") as fp:
            soup1 = bs4.BeautifulSoup(fp.read(), "html.parser")
    h1_tag = soup1.find(class_='box2')
    span_tag = soup1.find(class_='action_name')  
    h1_tag['style'] = 'display:block'
    try:
        cursor = conn.cursor()
        query = "DELETE FROM Rating WHERE Users_Id = {}".format(int(id_user))
        cursor.execute(query)
        cursor.execute("DELETE FROM Members WHERE Users_Id = {}".format(int(id_user)))
        
        rows_deleted = cursor.rowcount
        if rows_deleted ==0:
            span_tag.string.replace_with("Xoá thất bại")
        else:
            span_tag.string.replace_with("Xoá thành công")
        conn.commit()
    except pyodbc.Error as e:
        span_tag.string.replace_with("Xoá thất bại")
    return soup1.prettify() 

# Them User

@app.route('/themphim',methods=['post'])
def themphim():
    Movie_Name = request.form.get('name_movie')
    Movie_Url = request.form.get('image_movie')
    Director = request.form.get('author')
    Cast = request.form.get('actor_movie')
    Country = request.form.get('country')
    Duration = request.form.get('duration')
    with open("./templates/admin.html",encoding="utf-8") as fp:
            soup1 = bs4.BeautifulSoup(fp.read(), "html.parser")
    box2= soup1.find(class_='box2')
    span_tag = soup1.find(class_='action_name')  
    box2['style'] = 'display:block'
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO Movie (Movie_Name, Movie_Url, Director, Cast, Country, Duration)
        VALUES ( ?, ?, ?, ?, ?, ?)
        """
        params = ( Movie_Name, Movie_Url, Director, Cast, Country, Duration)
        cursor.execute(query, params)
        span_tag.string.replace_with("Thêm thành công")
        conn.commit()
    except pyodbc.Error as e:
        span_tag.string.replace_with("Thêm thất bại")
    return soup1.prettify() 

@app.route('/adduser',methods=['post'])
def adduser():
    name_user = request.form.get('name_user')
    email_user = request.form.get('email_user')
    pw_user = request.form.get('pw_user')
    with open("./templates/index.html",encoding="utf-8") as fp:
        soup1 = bs4.BeautifulSoup(fp.read(), "html.parser")
    new_box = soup1.find(class_='new_box')
    event_span_box = soup1.find(class_='event_span_box')
    on_to_dangnhap = soup1.find(class_='on_to_dangnhap')        
    cover_none = soup1.find(class_='cover_none')
    new_box['style'] = "display:block"       
    cursor = conn.cursor()
    cursor.execute("select * from Members where Email = '"+str(email_user)+"'")
    email = cursor.fetchall()
    if len(email) ==0:
        print('email_user',email_user,'pw_user',pw_user)
        if email_user=="" or pw_user=="":
            event_span_box.string.replace_with("Email hoặc mật khẩu không được bỏ trống!!!")
            on_to_dangnhap['style'] = "display:none"
        else:   
            try:
                query = """
                INSERT INTO Members ( Users_Name, Email, Matkhau)
                VALUES ( ?, ?, ?)
                """
                params = (name_user,email_user, pw_user)
                cursor.execute(query, params)                   
                event_span_box.string.replace_with("Thêm thành công")
                conn.commit()
            except pyodbc.Error as e:
                event_span_box.string.replace_with("Thêm thất bại")
    else:
        on_to_dangnhap['style'] = "display:none"
        event_span_box.string.replace_with("Email đã tồn tại!!!")
    cover_none['style'] = "display:block"
    return soup1.prettify()    
        
def trainmodels():
    train = []
    cursor = conn.cursor()
    cursor.execute("select Users_Id,Movie_Id,Rating from Rating")
    for row in cursor:
        train.append([row[0],row[1],row[2]])
    train = np.array(train)
    rs = CF(train, k = 5, uuCF = 1)
    rs.fit()
    os.remove("model.pkl")
    pickle.dump(rs,open('model.pkl','wb'))
    return rs
# Train model

@app.route('/trainmodel',methods=['post'])
def trainmodel():
    trainmodels()
    return render_template('admin.html')
# recommend
@app.route('/recommend',methods=['post'])
def recommend():
    rs = trainmodels()
    a,b = rs.recommend(id_copy)
    print('old_id_users',id_users)
    id_users.pop()
    id_users.append(a)
    print('new_id_users',id_users)   
    id_firm = id_users[0][0:4]
    return newPage(id_firm).prettify()

# danh gia
@app.route('/danhgia',methods=['post'])
def danhgia():
    id_movie = request.form.get('id_phim')
    id_user = request.form.get('id_nguoidung')
    rating_value = request.form.get('rating_user')
    pos = int(request.form.get('pos'))
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Rating WHERE Users_Id = '"+ str(id_user)+"'AND Movie_Id = '"+str(id_movie) +"' " )
    customers = cursor.fetchall()
    if len(customers)>0:
        update_statement = "UPDATE Rating SET Rating = '"+str(rating_value)+"'WHERE Users_Id = '"+ str(id_user)+"'AND Movie_Id = '"+str(id_movie) +"'"
        cursor.execute(update_statement)
    else:
        cursor.execute("INSERT INTO Rating (Movie_Id,Users_Id,Rating) VALUES (?, ?, ?)", int(id_movie),int(id_user),int(rating_value))
    conn.commit()
    trainmodel()
    with open("./templates/member.html",encoding="utf-8") as fp:
        soup = bs4.BeautifulSoup(fp.read(), "html.parser")
    
    rating_tag = soup.findAll(class_='rating')
    recommends = soup.findAll(class_='recommends')
    for i in recommends:
        i['style']='display:block'
    k=1
    for form in rating_tag:
        if k==pos:
            span = form.findAll(class_='star')
            j=0
            for s in span:
                if j<int(rating_value):
                    s['style']= "color: #ebed54"
                else:
                    s['style']= "color: rgb(192, 186, 186)"
                j+=1
            break
        k+=1
    with open("./templates/member.html", "w",encoding="utf-8") as f:
            f.write(str(soup))
    return soup.prettify()

id_users =[]
id_copy = []
@app.route('/goiykhac',methods=['post'])   
def goiykhac():
    id_firm = random.sample(id_users[0], 4)
    return newPage(id_firm).prettify()
def newPage(arr):
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Movie WHERE Movie_Id IN (?, ?, ?, ?);', *arr)
        customers = cursor.fetchall()
        with open("./templates/member_root.html",encoding="utf-8") as fp:
            soup = bs4.BeautifulSoup(fp.read(), "html.parser")
        # tim kiem cac the chau ten phim
        h1_tag = soup.findAll(class_='list_firm_img_right_title')
        # tim cac the chua mo ta
        tag_all = soup.findAll(class_='list_firm_img_right_inf')
        # tim cac the hinh anh
        img_tag = soup.findAll(class_='img_display')       
        # tim cac the de luu id nguoi dung
        id_nguoidung = soup.findAll(id='id_nguoidung')
        # tim cac the de luu id_movie 
        id_phim = soup.findAll(id='id_phim')
        
        # change name member
        cursor.execute("SELECT Users_Name,avatar FROM Members WHERE Users_Id = '"+ str(id_copy[0]) +"' ")
        name_user = cursor.fetchall()
        profile_text = soup.find(class_='profile_text')
        profile_text.string.replace_with(name_user[0][0])
        # luu anh
        avatar_src = soup.find(class_='profile-picture')
        avatar_src["src"] = name_user[0][1]
        login = soup.find("li",class_="login")
        if login:
            login['style'] = 'display:none'
        logout = soup.find("li",class_="logout")
        if logout:
            logout['style'] = 'display:block'
        # Change title
        j=0
        for i in h1_tag:
            i.string.replace_with(customers[j][1])
            j+=1
        # Change image
        j=0
        for img in img_tag:
            img["src"] = customers[j][2]
            j+=1
        # Change content
        j=0
        for p in tag_all:
            span = p.findAll(class_='inf_change')
            k=3
            for s in span:
                s.string.replace_with(customers[j][k])
                k+=1
            j+=1
        # Change value id người dùng
        for i in id_nguoidung:
            i['value'] = id_copy[0]
        # Change value id_movie
        j=3
        for i in id_phim:
            i['value'] = arr[j]
            j-=1
        # change id 
        span_id = soup.findAll(class_='inf_change_id')
        j=3
        for i in span_id:
            i.string.replace_with(str(arr[j]))
            j-=1
        with open("./templates/member.html", "w",encoding="utf-8") as f:
            f.write(str(soup))
        return soup
@app.route('/login',methods=['post'])   
def login():
    # Get Id 
    email = request.form.get('email')
    pw = request.form.get('password')
    cursor = conn.cursor()
    cursor.execute("SELECT Users_Id FROM Members WHERE Email='"+ str(email) +"'AND Matkhau ='"+ str(pw)+"'")
    id = cursor.fetchall()
    if len(id) >0:
        id = id[0][0]
        if len(id_copy) >0:
            id_copy.pop()
            id_copy.append(id)
        else:
            id_copy.append(id)
        cursor.execute("SELECT Users_Id FROM Rating WHERE Users_Id = '"+str(id)+"'")
        id_check = cursor.fetchall()
        if len(id_check) >0:
            list_id_user,list_same_user = model.recommend(int(id))       
            if len(id_users) >=1:
                id_users.pop()
                id_users.append(list_id_user)
            else:
                id_users.append(list_id_user)           
            id_firm = id_users[0][0:4]
            print('id_users',id_users)
            return newPage(id_firm).prettify()
        else:
            array = [i for i in range(1674)]
            id_firm = random.sample(array, 4)
            return newPage(id_firm).prettify()       
    else:
        cursor.execute("SELECT * FROM Admins WHERE Email='"+ str(email) +"'AND Matkhau ='"+ str(pw)+"'")
        admins = cursor.fetchall()
        if len(admins) >0:
            with open("./templates/admin.html",encoding="utf-8") as fp:
                soup = bs4.BeautifulSoup(fp.read(), "html.parser")
            name_pro = soup.find(class_="profile_text")
            name_pro.string.replace_with(admins[0][1])
            return soup.prettify()
        with open("./templates/index.html",encoding="utf-8") as fp:
            soup = bs4.BeautifulSoup(fp.read(), "html.parser")
        form_fair = soup.find(class_='new_box')
        event_span_box = soup.find(class_='event_span_box')      
        form_fair['style'] = 'display:block'
        event_span_box.string.replace_with('Sai email or mật khẩu')
        cover_none = soup.find(class_='cover_none')
        cover_none['style'] = 'display:block'        
        return soup.prettify()
app.run()
