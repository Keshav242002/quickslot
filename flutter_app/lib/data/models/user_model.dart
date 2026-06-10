import 'package:equatable/equatable.dart';

class UserModel extends Equatable {
  final int id;
  final String uid;
  final String email;
  final String name;

  const UserModel({
    required this.id,
    required this.uid,
    required this.email,
    required this.name,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['id'],
        uid: json['firebase_uid'] ?? json['uid'] ?? '',
        email: json['email'],
        name: json['name'] ?? json['display_name'] ?? '',
      );

  @override
  List<Object?> get props => [id, uid, email, name];
}
