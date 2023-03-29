import 'package:flutter/material.dart';
import 'package:flutter_chat_bubble/chat_bubble.dart'
    show BubbleType, ChatBubble, ChatBubbleClipper5;

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
            backGroundColor: !isMe
                ? Colors.lightBlue.shade300.withOpacity(0.5)
                : Colors.purpleAccent.shade100.withOpacity(0.5),
            alignment: isMe ? Alignment.topRight : Alignment.topLeft,
            margin: const EdgeInsets.only(top: 5),
            child: Text(
              message.toString(),
              style: const TextStyle(
                  fontSize: 17,
                  color: Colors.white,
                  fontFamily: 'InstagramSans'),
            )),
      ],
    );
  }
}
