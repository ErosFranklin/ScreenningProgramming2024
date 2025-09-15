from bcrypt import gensalt, hashpw
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from controllers.student_controller import *

from models.Student import Student

user_app = Blueprint('user_app', __name__)

@user_app.route('/api/student', methods=['POST'])
def add_user_router():
    data = request.get_json()

    name = data.get('nameStudent').lower()
    email = data.get('emailStudent').lower()
    birth = data.get('birthStudent')
    password = data.get('passwordStudent')
    confirm_password = data.get('confirm_password_Student')
    

    if not all([name, email, birth, password, confirm_password]):
        return jsonify({"message": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"message": "Passwords do not match!"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must have at least 6 characters"}), 400
    
    if len(password) > 20:
        return jsonify({"message": "Password must not exceed 20 characters"})
    
    if "@" not in email:
        return jsonify({"message": "Invalid email"}), 400

    domain = email.split("@")[-1]
    allowed_domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "aluno.uepb.edu.br"]
    if domain not in allowed_domains:
        return jsonify({"message": "Only specific email domains are allowed"}), 401

    hashed_password = hashpw(password.encode('utf-8'), gensalt())

    data['passwordStudent'] = hashed_password.decode('utf-8')  

    response, status_code = add_student_controller(data)
    return jsonify(response), status_code

@user_app.route("/api/student/<user_id>", methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Dados inválidos"}), 400

    if len(data) == 0:
        return jsonify({"error": "Nenhum campo enviado para atualização"}), 400

    field, value = next(iter(data.items()))

    try:
        update_student_controller(user_id, field, value)
        return jsonify({"message": "Usuário atualizado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_app.route("/api/student/<user_id>", methods=["DELETE"])
@jwt_required()
def delete_users(user_id):
    current_user_id = get_jwt_identity()
    current_user_id = current_user_id['id']
    response, status_code = delete_student_controller(current_user_id,user_id)
    return jsonify(response), status_code

@user_app.route('/api/students', methods=['GET'])
def get_users_route():
    response = get_student_controller()
    return jsonify(response)


@user_app.route('/alterarNome', methods=['POST'])
def rename_table():
    data = request.get_json()

    current_name = data.get('current_name')
    new_name = data.get('new_name')

    if not all([current_name, new_name]):
        return jsonify({"message": "All fields are required"}), 400
    response = Student.rename_table(current_name, new_name)
    return jsonify(response)

