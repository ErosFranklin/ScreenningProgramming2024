from models.Users import User


class Teacher(User):
    def __init__(self, name, email, password, last_name=None, birth=None, gender=None, institution=None, subject=None, certificate=None, state=None, city=None):
        super().__init__(name, email, password, last_name, birth, gender, institution, certificate, state, city)
        self.subject = subject

    def to_db_format(self):
        return {
            'nameTeacher': self.name,
            'emailTeacher': self.email,
            'passwordTeacher': self.password,
            'lastNameTeacher': self.last_name,
            'birthTeacher': self.birth,
            'genderTeacher': self.gender,
            'institutionTeacher': self.institution,
            'subjectTeacher': self.subject,
            'certificateTeacher': self.certificate,
            'stateTeacher': self.state,
            'cityTeacher': self.city
        }


    def create_teacher_service(self, connection):
        teacher_data = self.to_db_format()
        return self.create_user_service(connection, 'professor', teacher_data)
    

    def update_teacher_service(connection, user_id, field, value):
        User.update_user_service(connection, 'professor', user_id, field, value)


    @staticmethod
    def get_all_teacher_service(connection):
        return User.get_all_user_service(connection, 'professor')
    

    @staticmethod
    def delete_teacher_service(connection, user_id):
        return User.delete_user_service(connection, user_id, 'professor')
    

    @staticmethod
    def get_teacher_by_id_email(connection, email):
        return User.get_user_by_id_email(connection, email, 'professor')
