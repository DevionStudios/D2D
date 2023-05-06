import 'package:flutter/material.dart';
import 'package:foxxi/models/comments.dart';

class CommentProvider extends ChangeNotifier {
  List<Comment> _commentList = [];
  List<Comment> get commentList => _commentList;

  void setCommentList(List<Comment> comments) {
    _commentList = comments;
    notifyListeners();
  }
}
