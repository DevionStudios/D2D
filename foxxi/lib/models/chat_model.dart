import 'dart:convert';

import 'package:foxxi/models/user.dart';

class ChatModel {
  final String messageText;
  final User sender;
  final DateTime time;
  ChatModel({
    required this.messageText,
    required this.sender,
    required this.time,
  });

  Map<String, dynamic> toMap() {
    return {
      'messageText': messageText,
      'sender': sender.toMap(),
      'time': time.millisecondsSinceEpoch,
    };
  }

  factory ChatModel.fromMap(Map<String, dynamic> map) {
    return ChatModel(
      messageText: map['messageText'] ?? '',
      sender: User.fromMap(map['sender']),
      time: DateTime.fromMillisecondsSinceEpoch(map['time']),
    );
  }

  String toJson() => json.encode(toMap());

  factory ChatModel.fromJson(String source) =>
      ChatModel.fromMap(json.decode(source));
}
