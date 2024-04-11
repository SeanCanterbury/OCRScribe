from app import db
from datetime import datetime
from flask_login import UserMixin

#model for user
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username
    
#uploads model    
class Upload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_name = db.Column(db.String(120), nullable=False)
    file_path = db.Column(db.String(120), nullable=False)
    text_extracted = db.Column(db.String(120), nullable=False, default='No text extracted')
    uploaded_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('uploads', lazy=True))

    def __repr__(self):
        return '<Upload %r>' % self.filename

    
    
