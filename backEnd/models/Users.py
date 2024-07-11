from aifc import Error

class User:
    def __init__(self, name, email, password, last_name=None, birth=None, gender=None, institution=None, certificate=None, state=None, city=None):
        self.id = None
        self.name = name
        self.email = email
        self.password = password
        self.last_name = last_name
        self.birth = birth
        self.gender = gender
        self.institution = institution
        self.certificate = certificate
        self.state = state
        self.city = city


    def create_user_service(self, connection, user_type, user_data):
        try:
            cursor = connection.cursor()
            if user_type == 'aluno':
                cursor.execute("""
                    INSERT INTO aluno (nameStudent, emailStudent, passwordStudent) 
                    VALUES (%s, %s, %s)
                """, (
                    user_data['nameStudent'], user_data['emailStudent'], user_data['passwordStudent'], 
                
                ))
                connection.commit()
                cursor.execute("SELECT LAST_INSERT_ID()")
                inserted_id = cursor.fetchone()[0]
                return inserted_id
        except Exception as e:
            print(f"Erro ao criar usuário: {e}")
            connection.rollback()
            return None
    

    def update_user_service(connection, table_name, user_id, field, value):
        cursor = connection.cursor()

        # Montei a query de atualização para um único campo
        sql = f"UPDATE {table_name} SET {field} = %s WHERE id = %s"

        cursor.execute(sql, (value, user_id))
        connection.commit()
        cursor.close()
    

    @staticmethod
    def get_all_user_service(connection, table_name):
        cursor = connection.cursor()
        cursor.execute(f"SELECT name, last_name, email FROM {table_name}")
        students = cursor.fetchall()
        cursor.close()
        return students
    
    @staticmethod
    def delete_user_service(connection, user_id, table_name):
        cursor = connection.cursor()
        cursor.execute(f"DELETE FROM {table_name} WHERE id = %s", (user_id,))
        connection.commit()
        cursor.close()


    @staticmethod
    def get_user_by_id_email(connection, email, table_name):
        cursor = connection.cursor()
        try:
            cursor.execute(f"SELECT * FROM {table_name} WHERE email = %s", (email,))
            user = cursor.fetchone()  

            if user:
                return {
                    "id": user[0],
                    "name": user[1],  
                    "email": user[2]
                    
                }
            else:
                return None

        finally:
            cursor.close()


    @classmethod
    def rename_table(cls, connection, current_name, new_name):
        try:
            cursor = connection.cursor()
            cursor.execute(f"ALTER TABLE {current_name} RENAME TO {new_name}")
            connection.commit()
            cursor.close()
            print(f"Tabela '{current_name}' renomeada para '{new_name}' com sucesso.")
            return True
        except Error as e:
            print(f"Erro ao tentar renomear a tabela: {e}")
            return False



'''
    @staticmethod
    def get_user_by_email_model(email):
        users_collection = db.users
        user = users_collection.find_one({"email": email})
        return user
    
    @staticmethod
    def get_user_by_id_model(id):
        users_collection = db.users
        user = users_collection.find_one({"_id": ObjectId(id)})
        if user:
            user["_id"] = str(user["_id"])
            return user
        return None
    
    @staticmethod
    def update_user(user_id, updated_fields):
        users_collection = db.users
        result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updated_fields})
        return result
        
    @staticmethod
    def delete_account_model(user_id):
        users_collection = db.users
        result = users_collection.find_one_and_delete({"_id": ObjectId(user_id)})
        return result
    
    def add_new_field_to_all_users(new_field_name):
        users_collection = db.users
        result = users_collection.update_many({}, {"$set": {new_field_name: []}})
        return result

    
    def update_user_image_model(user_id, image_url):
        users_collection = db.users
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'image': image_url}}
        )

        if result.modified_count == 0:
            raise Exception(f"Failed to update user's image with id {user_id}.")

        return {"message": "Image added successfully"}'''