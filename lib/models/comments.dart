// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

import 'package:foxxi/models/user.dart';

class Comment {
  final String id;
  final String caption;
  final User author;
  final String postId;
  Comment({
    required this.id,
    required this.caption,
    required this.author,
    required this.postId,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'caption': caption,
      'author': author.toMap(),
      'postId': postId,
    };
  }

  factory Comment.fromMap(Map<String, dynamic> map) {
    return Comment(
      id: map['id'] ?? '',
      caption: map['caption'] ?? '',
      author: User.fromMap(map['author']),
      postId: map['postId'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory Comment.fromJson(String source) =>
      Comment.fromMap(json.decode(source));
}
