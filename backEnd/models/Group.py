from flask import json
import mysql.connector
from mysql.connector import Error

class Group:
    def __init__(self, id_teacher, id_students, title, period):
        self.id_teacher = id_teacher
        self.id_students = id_students
        self.title = title
        self.period = period
        #self.students = students if students is not None else []

    def create_group_service(self, connection):
        try:
            cursor = connection.cursor()

            #student_ids_json = json.dumps(self.students)

            cursor.execute("INSERT INTO group_table (id_teacher, id_student, title, period) VALUES (%s, %s, %s, %s)",
                           (self.id_teacher, self.id_students, self.title, self.period))
            connection.commit()
            print("Group saved successfully")
            inserted_id = cursor.lastrowid 
            return inserted_id
            
        except Error as e:
            print(f"Error saving group to database: {e}")
        
        finally:
            cursor.close()


    @staticmethod
    def add_student_to_group_service(connection, group_id, student_id):
        try:
            cursor = connection.cursor()

            cursor.execute("SELECT id_student FROM group_table WHERE id = %s", (group_id,))
            group_data = cursor.fetchone()
            if not group_data:
                cursor.close()
                return False

            student_ids = json.loads(group_data[0]) if group_data[0] else []
            if student_id not in student_ids:
                student_ids.append(student_id)
                student_ids_json = json.dumps(student_ids)

                cursor.execute("UPDATE group_table SET id_student = %s WHERE id = %s", (student_ids_json, group_id))
                connection.commit()

            cursor.close()
            return True

        except Error as e:
            print(f"Error adding student to group: {e}")
            return False

    @staticmethod
    def get_students_from_group_model(self,connection,group_id):
        cursor = connection.cursor()
        cursor.execute("SELECT id_student FROM group_table WHERE id = %s", (group_id,))        