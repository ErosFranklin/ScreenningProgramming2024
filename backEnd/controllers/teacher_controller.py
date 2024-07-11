from models.Teacher import Teacher
from db.bd_mysql import db_connection

from middleware.global_middleware import (
    verify_user)

def add_teacher_controller(data):
    name = data.get('nameTeacher').lower()
    email = data.get('emailTeacher').lower()
    password = data.get('passwordTeacher')

    connection = db_connection()
    if connection:
        teacher = Teacher(
            name=name,
            email=email,
            password=password
        )
        teacher_id = teacher.create_teacher_service(connection)
        connection.close()
        
        if teacher_id:
            return {"id": teacher_id, "message": 'Usuário criado com sucesso!'}, 201
        else:
            return {"message": "Erro ao criar usuário!"}, 500
        
    else:
        return {"message": "Falha ao conectar com o banco de dados!"}, 500

def get_teacher_controller():
    connection = db_connection()
    if connection:
        users = Teacher.get_all_teacher_service(connection)
        connection.close()
        return users
    else:
        return {"message": "Falha ao conectar com o banco de dados!"}, 500

def update_teacher_controller(user_id, field, value):
    connection = db_connection()
    if connection:
        try:
            Teacher.update_teacher_service(connection, user_id, field, value)
            connection.close()
            return {"message": 'Atualização feita com sucesso!'}, 200
        except Exception as e:
            return {"error": str(e)}, 500
    else:
        return {"error": "Falha ao conectar com o banco de dados!"}, 500

def delete_teacher_controller(user_id):
    connection = db_connection()
    if connection:
        verify_user(user_id)
        Teacher.delete_teacher_service(connection, user_id)
        connection.close()
        return {"message": "User deletedo"}, 200
    else:
        return {"message": "Falha ao conectar com o banco de dados!"}, 500
    
def get_teacher_by_id_email_controller(email):
    connection = db_connection()
    if connection:
        user = Teacher.get_teacher_by_id_email(connection, email)
        connection.close()
        return user
    else:
        return {"message": "Falha ao conectar com o banco de dados!"}, 500
