import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_chat_bubble/chat_bubble.dart';
import 'dart:developer' as dev;
import 'package:foxxi/models/user.dart';
import 'package:foxxi/providers/user_provider.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/services/message_service.dart';
import 'package:foxxi/widgets/message_bubble.dart';
import 'package:provider/provider.dart';

import '../models/chat_model.dart';
import '../providers/theme_provider.dart';
import 'chat_screen.dart';

class ChatScreen extends StatefulWidget {
  final String? userName;
  @override
  const ChatScreen({super.key, this.userName});
  @override
  ChatScreenState createState() {
    return ChatScreenState();
  }
}

class ChatScreenState extends State<ChatScreen> {
  get key => null;
  List<User>? associatedUserList;
  MessageService messageService = MessageService();

  @override
  void initState() {
    setAssociatedUserList();

    super.initState();
  }

  void setAssociatedUserList() async {
    {
      associatedUserList =
          await messageService.getAssociatedUsers(context: context);
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    return Expanded(
      child: Container(
        decoration: BoxDecoration(
            color: isDark ? Colors.grey.shade300 : Colors.white,
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(0),
              bottomRight: Radius.circular(0),
              topLeft: Radius.circular(30),
              topRight: Radius.circular(30),
            )),
        child: ListView.builder(
          padding: const EdgeInsets.only(top: 30),
          itemCount: associatedUserList?.length == null
              ? 0
              : associatedUserList!.length,
          itemBuilder: (context, i) => OpenContainer(
            transitionDuration: const Duration(milliseconds: 600),
            openBuilder: (context, _) => OneOneChatScreen(
              senderId: associatedUserList![i].id.toString(),
              senderName: associatedUserList![i].name.toString(),
              senderImage: associatedUserList![i].image.toString(),
              senderUsername: associatedUserList![i].username.toString(),
              key: key,
            ),
            closedBuilder: (context, Function openContainer) => Column(
              children: <Widget>[
                Container(
                  // height: 50,
                  // decoration: BoxDecoration(
                  //   border: Border.all(
                  //     color: isDark ? Colors.grey.shade300 : Colors.white,
                  //     width: 30,
                  //     strokeAlign: BorderSide.strokeAlignOutside,
                  //   ),
                  color: isDark ? Colors.grey.shade300 : Colors.white,
                  // borderRadius: const BorderRadius.all(
                  //   Radius.circular(10),
                  // ),

                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: <Widget>[
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: CircleAvatar(
                          backgroundImage: NetworkImage(
                              associatedUserList![i].image.toString()),
                        ),
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            associatedUserList![i].name.toString(),
                            style: const TextStyle(fontFamily: 'InstagramSans'),
                          ),
                          // Text(
                          //   releChatData[i].message.toString(),
                          //   style: const TextStyle(
                          //       color: Colors.grey, fontSize: 14.0),
                          // ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class OneOneChatScreen extends StatefulWidget {
  static const String routeName = oneOnOneChatScreenRoute;

  final String senderName;
  final String senderUsername;
  final String senderImage;
  final String senderId;
  const OneOneChatScreen(
      {super.key,
      required this.senderId,
      required this.senderName,
      required this.senderUsername,
      required this.senderImage});

  @override
  State<OneOneChatScreen> createState() => _OneOneChatScreenState();
}

class _OneOneChatScreenState extends State<OneOneChatScreen> {
  get key => null;
  MessageService messageService = MessageService();
  final TextEditingController _messageTextController = TextEditingController();

  @override
  void dispose() {
    _messageTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context, listen: true).user;
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    return Scaffold(
      backgroundColor:
          isDark ? Colors.black.withOpacity(0.9) : Colors.grey.shade400,
      body: Padding(
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
        child: Stack(
          fit: StackFit.passthrough,
          children: [
            Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Container(
                          padding: const EdgeInsets.all(16),
                          height: 100,
                          // width: MediaQuery.of(context).size.width * 0.1,
                          child: CircleAvatar(
                            backgroundColor:
                                Colors.purpleAccent.shade100.withOpacity(0.4),
                            child: IconButton(
                              // iconSize: 20,
                              icon: const Icon(
                                Icons.arrow_back_ios_new,
                                color: Colors.grey,
                                // size: 15,
                              ),
                              onPressed: () {
                                Navigator.pop(context);
                              },
                            ),
                          )),
                      Container(
                        padding: const EdgeInsets.all(16),
                        height: 100,
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Text(
                                widget.senderName.toString(),
                                style: TextStyle(
                                    color: isDark ? Colors.grey : Colors.black,
                                    fontSize: 15,
                                    fontFamily: 'Unbounded',
                                    fontWeight: FontWeight.bold),
                              ),
                              Text(
                                '@${widget.senderUsername.toString()}',
                                style: TextStyle(
                                  color: isDark ? Colors.grey : Colors.black,
                                  fontSize: 10,
                                  fontFamily: 'Unbounded',
                                ),
                              )
                            ]),
                        // width: MediaQuery.of(context).size.width * 0.8),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: ClipRRect(
                            // padding: EdgeInsets.all(16),
                            // height: 100,
                            child: Container(
                          // padding: EdgeInsets.all(16),
                          decoration: BoxDecoration(
                              border: Border.all(color: Colors.white, width: 2),
                              borderRadius:
                                  const BorderRadius.all(Radius.circular(20))),
                          child: CircleAvatar(
                            radius: 20,
                            backgroundImage:
                                NetworkImage(widget.senderImage.toString()),
                          ),
                        )

                            // width: MediaQuery.of(context).size.width * 0.1,
                            ),
                      ),
                    ]),
                Expanded(
                  child: Container(
                      padding: const EdgeInsets.only(
                        bottom: 70,
                      ),
                      decoration: BoxDecoration(
                          color: isDark ? Colors.grey.shade900 : Colors.white,
                          borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(30),
                              topRight: Radius.circular(30))),
                      child: ChatStreamBuilder(
                        senderId: widget.senderId.toString(),
                      )),
                ),
              ],
            ),
            Align(
              alignment: const AlignmentDirectional(-1, 1),
              child: Container(
                padding: const EdgeInsetsDirectional.fromSTEB(30, 10, 30, 10),
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                            color: Colors.grey.shade300.withOpacity(0.6),
                            borderRadius:
                                const BorderRadius.all(Radius.circular(20))),
                        // color: Colors.grey.shade400,
                        width: double.infinity,
                        child: TextFormField(
                          controller: _messageTextController,
                          autofocus: false,
                          obscureText: false,
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Message...',
                          ),
                          textAlign: TextAlign.end,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        Icons.send_rounded,
                        color: Colors.purpleAccent.shade100.withOpacity(0.4),
                        size: 30,
                      ),
                      onPressed: () {
                        messageService.addMessage(
                            context: context,
                            text: _messageTextController.text,
                            from: userProvider.id.toString(),
                            to: widget.senderId.toString());

                        _messageTextController.clear();
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ChatStreamBuilder extends StatelessWidget {
  final String senderId;
  const ChatStreamBuilder({super.key, required this.senderId});

  @override
  Widget build(BuildContext context) {
    MessageService messageService = MessageService();

    final userProvider = Provider.of<UserProvider>(context, listen: true).user;

    Stream<List<ChatModel>?> chatsStream() async* {
      while (true) {
        await Future.delayed(const Duration(milliseconds: 1000));
        if (context.mounted) {
          var chat = await messageService.getAllMessages(
              context: context, to: senderId.toString(), from: userProvider.id);

          yield chat;
        }
      }
    }

    return StreamBuilder<List<ChatModel>?>(
      stream: chatsStream(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Center(
                child: Text(
                  'NO CHATS TO SHOW YET',
                  style: TextStyle(fontSize: 20),
                ),
              )
            ],
          );
        }
        List<ChatModel> messages = snapshot.data!;

        List<Widget> messageList = [];

        for (var message in messages) {
          final messageBubble =
              MessageBubble(message: message.message, isMe: message.fromSelf);
          messageList.add(messageBubble);
        }

        // messageList.add(message);

        return Padding(
          padding: const EdgeInsets.all(8.0),
          child: ListView(children: messageList),
        );
      },
    );
  }
}
