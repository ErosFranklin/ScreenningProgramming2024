from flask import json
import mysql.connector
from mysql.connector import Error

class Group:

    def __init__(self, name, period, students=None):
        self.name = name
        self.period = period
        self.students = students if students is not None else []

    def create_group_service(self, connection):
        try:
            cursor = connection.cursor()

            student_ids_json = json.dumps(self.students)

            cursor.execute("INSERT INTO group_table (name, period, student_ids) VALUES (%s, %s, %s)",
                           (self.name, self.period, student_ids_json))
            connection.commit()
            cursor.close()
            print("Group saved successfully")
        except Error as e:
            print(f"Error saving group to database: {e}")


    @staticmethod
    def add_student_to_group_service(connection, group_id, student_id):
        try:
            cursor = connection.cursor()

            cursor.execute("SELECT student_ids FROM group_table WHERE id = %s", (group_id,))
            group_data = cursor.fetchone()
            if not group_data:
                cursor.close()
                return False

            student_ids = json.loads(group_data[0]) if group_data[0] else []
            if student_id not in student_ids:
                student_ids.append(student_id)
                student_ids_json = json.dumps(student_ids)

                cursor.execute("UPDATE group_table SET student_ids = %s WHERE id = %s", (student_ids_json, group_id))
                connection.commit()

            cursor.close()
            return True

        except Error as e:
            print(f"Error adding student to group: {e}")
            return False

    @staticmethod
    def get_students_from_group_model(self,connection,group_id):
        cursor = connection.cursor()
        cursor.execute("SELECT student_ids FROM group_table WHERE id = %s", (group_id,))        