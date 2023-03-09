import 'package:flutter/material.dart';
import 'package:flutter_chat_bubble/bubble_type.dart';
import 'package:flutter_chat_bubble/chat_bubble_ui.dart';
import 'package:flutter_chat_bubble/clippers/chat_bubble_clipper_5.dart';

import 'package:foxxi/models/chat_model.dart';

class MessageBubble extends StatelessWidget {
  final String message;
  final bool isMe;
  const MessageBubble({
    Key? key,
    required this.message,
    required this.isMe,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        // Padding(
        //   padding: const EdgeInsets.all(5.0),
        //   child: isMe
        //       ? null
        //       : CircleAvatar(
        //           backgroundImage: NetworkImage(
        //             chat.sender.image.toString(),
        //           ),
        //         ),
        // ),
        ChatBubble(
            clipper: ChatBubbleClipper5(
                type: isMe ? BubbleType.sendBubble : BubbleType.receiverBubble),
            backGroundColor: Colors.grey.shade500,
            alignment: isMe ? Alignment.topRight : Alignment.topLeft,
            margin: const EdgeInsets.only(top: 5),
            child: Text(
              message.toString(),
              style: const TextStyle(color: Colors.white),
            )),
      ],
    );
  }
}
