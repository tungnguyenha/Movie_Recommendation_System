import pyodbc
import openpyxl
import pandas as pd
conn = pyodbc.connect(driver= '{ODBC Driver 17 for SQL Server}',\
    host ='LAPTOP-48QSU778\SQLEXPRESS',database ='TestDB',\
    UID='quy123',PWD='123',trusted_connection='yes')
df = pd.read_excel("detail.xlsx")
df = df.iloc[:, 1:]
data = df.to_numpy()
cursor = conn.cursor()
for i in data:
    if i[1] >= 1674:
        continue
    cursor.execute("INSERT INTO Rating (Movie_Id,Users_Id,Rating) VALUES (?,?,?)",int(i[1]),int(i[0]),int(i[2]))
# j=0
# for i in data:
#     if j >= 949:
#         continue
#     cursor.execute("INSERT INTO Members (avatar) VALUES (?)",i[0])
#     j+=1
#     print(j)
# j=0
# for i in data:
#     print(i[0])
#     if j>=949:
#         continue
#     update_statement = "UPDATE Members SET avatar = '"+str(i[0])+"' WHERE Users_Id = '"+str(j)+"'"
#     cursor.execute(update_statement)
#     j+=1
conn.commit()
print('success')