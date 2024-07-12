from flask import abort
#from models.Student import Student
from db.bd_mysql import db_connection
from models.Student import Student


def verify_user(userId):
    connection = db_connection()
    if not connection:
        abort(500, {"message": "Database connection error"})
    user = Student.get_student_by_id_service(connection, userId)
    connection.close()

    if not user:
        abort(400, {"message": "User not exist"})
    return user

#def verify_username_registered(username):
    #user = Student.get_user_by_username_service(username)
    #if user:
        #abort(400, {"message": "Username is not available"})
    #return {"message": "Username is available"}

#def verify_email_registered(email):          
    #user = Student.get_user_by_email_model(email)
    #if user:
        #abort(400, {"message": "Email is not available"})
    #return {"message": "Email is available"}
 
#def verify_change_in_user(user_id, field_name, new_value):
    #user = verify_user(user_id)
    #if field_name in user:
        #current_value = user[field_name]
        #if current_value == new_value:
            #abort(400, f"The {field_name} is the same")
        #return current_value
    #else:
        #abort(400, f"User data is missing '{field_name}' field")