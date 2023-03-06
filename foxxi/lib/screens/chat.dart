// import 'dart:ui';

// import 'package:flutter/material.dart';
// import 'package:flutter_chat_bubble/bubble_type.dart';
// import 'package:flutter_chat_bubble/chat_bubble.dart';
// import 'package:flutter_chat_bubble/clippers/chat_bubble_clipper_2.dart';
// import 'package:flutter_chat_bubble/clippers/chat_bubble_clipper_3.dart';
// import 'package:flutter_chat_bubble/clippers/chat_bubble_clipper_4.dart';
// import 'package:flutter_chat_bubble/clippers/chat_bubble_clipper_5.dart';
// import '../models/chat_model.dart';
// import 'package:animations/animations.dart';

// import 'chat_screen.dart';

// class ChatScreen extends StatefulWidget {
//   @override
//   Key? key;
//   String? userName;
//   @override
//   ChatScreen({this.userName});
//   ChatScreenState createState() {
//     return ChatScreenState();
//   }
// }

// class ChatScreenState extends State<ChatScreen> {
//   get key => null;

//   @override
//   Widget build(BuildContext context) {
//     List<ChatModel>? releChatData = [];
//     dummyData.forEach((element) {
//       if (element.name != widget.userName &&
//           element.userName == widget.userName) {
//         releChatData.add(element);
//       }
//     });
//     return Expanded(
//       child: Container(
//         decoration: const BoxDecoration(
//             color: Colors.white,
//             borderRadius: BorderRadius.only(
//               bottomLeft: Radius.circular(0),
//               bottomRight: Radius.circular(0),
//               topLeft: Radius.circular(30),
//               topRight: Radius.circular(30),
//             )),
//         child: ListView.builder(
//           padding: const EdgeInsets.only(top: 30),
//           itemCount: releChatData.length,
//           itemBuilder: (context, i) => OpenContainer(
//             transitionDuration: const Duration(milliseconds: 600),
//             openBuilder: (context, _) => OneOneChatScreen(
//               userName: widget.userName,
//               allChatData: dummyData,
//               receiptentName: releChatData[i].name,
//               key: key,
//             ),
//             closedBuilder: (context, Function openContainer) => Column(
//               children: <Widget>[
//                 Card(
//                   child: Container(
//                     // height: 50,
//                     width: MediaQuery.of(context).size.width - 20,
//                     decoration: BoxDecoration(
//                       border: Border.all(
//                         color: Colors.white,
//                         width: 30,
//                         strokeAlign: StrokeAlign.outside,
//                       ),
//                       color: Colors.white,
//                       // borderRadius: const BorderRadius.all(
//                       //   Radius.circular(10),
//                       // ),
//                     ),
//                     child: Row(
//                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                       children: [
//                         Row(
//                           children: [
//                             Row(
//                               mainAxisAlignment: MainAxisAlignment.start,
//                               children: <Widget>[
//                                 CircleAvatar(
//                                   backgroundImage: NetworkImage(
//                                       releChatData[i].avatarUrl.toString()),
//                                 ),
//                                 Column(
//                                   mainAxisAlignment:
//                                       MainAxisAlignment.spaceEvenly,
//                                   crossAxisAlignment: CrossAxisAlignment.start,
//                                   children: [
//                                     Text(
//                                       releChatData[i].name.toString(),
//                                       style: const TextStyle(
//                                           fontWeight: FontWeight.bold),
//                                     ),
//                                     Text(
//                                       releChatData[i].message.toString(),
//                                       style: const TextStyle(
//                                           color: Colors.grey, fontSize: 14.0),
//                                     ),
//                                   ],
//                                 ),
//                               ],
//                             ),
//                           ],
//                         ),
//                         Padding(
//                           padding: const EdgeInsets.all(8.0),
//                           child: Text(
//                             releChatData[i].time.toString(),
//                             style: const TextStyle(
//                               color: Colors.grey,
//                               fontSize: 14.0,
//                             ),
//                             textAlign: TextAlign.end,
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                 ),
//                 const Divider(height: 10, color: Colors.white),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// class OneOneChatScreen extends StatefulWidget {
//   String? userName;
//   String? receiptentName;
//   List<ChatModel>? allChatData;
//   Key? key;
//   // String? userProfilePic;
//   // String? receiptentProfilePc;
//   // const OneOneChatScreen({super.key});
//   OneOneChatScreen(
//       {this.allChatData, this.userName, this.receiptentName, this.key});

//   @override
//   State<OneOneChatScreen> createState() => _OneOneChatScreenState();
// }

// class _OneOneChatScreenState extends State<OneOneChatScreen> {
//   get key => null;

//   @override
//   Widget build(BuildContext context) {
//     List<ChatModel> data = [];
//     // print(widget.allChatData![0].name);
//     widget.allChatData!.forEach(((element) {
//       if ((element.userName == widget.userName &&
//               element.name == widget.receiptentName) ||
//           (element.userName == widget.receiptentName &&
//               element.name == widget.userName)) {
//         data.add(element);
//         // print(data![0].name);
//       }
//     }));

//     return Scaffold(
//       backgroundColor: Colors.grey.shade400,
//       body: Padding(
//         padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
//         child: Stack(
//           fit: StackFit.passthrough,
//           children: [
//             Column(
//               mainAxisSize: MainAxisSize.max,
//               children: [
//                 Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                     mainAxisSize: MainAxisSize.max,
//                     children: [
//                       Container(
//                           padding: const EdgeInsets.all(16),
//                           height: 100,
//                           // width: MediaQuery.of(context).size.width * 0.1,
//                           child: CircleAvatar(
//                             child: IconButton(
//                               // iconSize: 20,
//                               icon: const Icon(
//                                 Icons.arrow_back_ios_new,
//                                 color: Colors.grey,
//                                 // size: 15,
//                               ),
//                               onPressed: () {
//                                 Navigator.pushReplacement(
//                                     context,
//                                     MaterialPageRoute(
//                                         builder: (context) => const Chat()));
//                               },
//                             ),
//                           )),
//                       Container(
//                         padding: const EdgeInsets.all(16),
//                         height: 100,
//                         child: Column(
//                             mainAxisAlignment: MainAxisAlignment.center,
//                             mainAxisSize: MainAxisSize.max,
//                             children: [
//                               Text(
//                                 data[0].name.toString(),
//                                 style: const TextStyle(
//                                     fontSize: 15,
//                                     fontFamily: 'Unbounded',
//                                     fontWeight: FontWeight.bold),
//                               ),
//                               Text(
//                                 data[0].userName.toString(),
//                                 style: const TextStyle(
//                                   fontSize: 5,
//                                   fontFamily: 'Unbounded',
//                                 ),
//                               )
//                             ]),
//                         // width: MediaQuery.of(context).size.width * 0.8),
//                       ),
//                       Padding(
//                         padding: const EdgeInsets.all(16),
//                         child: ClipRRect(
//                             // padding: EdgeInsets.all(16),
//                             // height: 100,
//                             child: Container(
//                           // padding: EdgeInsets.all(16),
//                           decoration: BoxDecoration(
//                               border: Border.all(color: Colors.white, width: 2),
//                               borderRadius:
//                                   const BorderRadius.all(Radius.circular(20))),
//                           child: CircleAvatar(
//                             radius: 20,
//                             backgroundImage:
//                                 NetworkImage(data[0].userProfilePic.toString()),
//                           ),
//                         )

//                             // width: MediaQuery.of(context).size.width * 0.1,
//                             ),
//                       ),
//                     ]),
//                 Expanded(
//                   child: Container(
//                     padding: const EdgeInsets.only(
//                       bottom: 70,
//                     ),
//                     decoration: const BoxDecoration(
//                         color: Colors.white,
//                         borderRadius: BorderRadius.only(
//                             topLeft: Radius.circular(30),
//                             topRight: Radius.circular(30))),
//                     child: ListView.builder(
//                       reverse: true,
//                       itemCount: data.length,
//                       itemBuilder: (BuildContext context, index) {
//                         return data[index].name == widget.receiptentName
//                             ? Row(
//                                 children: [
//                                   Padding(
//                                     padding: const EdgeInsets.all(5.0),
//                                     child: CircleAvatar(
//                                       backgroundImage: NetworkImage(
//                                         data[0].avatarUrl.toString(),
//                                       ),
//                                     ),
//                                   ),
//                                   ChatBubble(
//                                       clipper: ChatBubbleClipper5(
//                                           type: BubbleType.receiverBubble),
//                                       backGroundColor: Colors.grey.shade500,
//                                       margin: const EdgeInsets.only(top: 5),
//                                       child: Text(
//                                         data[index].message.toString(),
//                                         style: const TextStyle(
//                                             color: Colors.white),
//                                       )),
//                                 ],
//                               )
//                             : Row(
//                                 mainAxisAlignment: MainAxisAlignment.end,
//                                 children: [
//                                   ChatBubble(
//                                       clipper: ChatBubbleClipper5(
//                                           type: BubbleType.sendBubble),
//                                       alignment: Alignment.topRight,
//                                       backGroundColor: Colors.blue.shade300,
//                                       margin: const EdgeInsets.only(top: 5),
//                                       child: Container(
//                                         constraints: BoxConstraints(
//                                           maxWidth: MediaQuery.of(context)
//                                                   .size
//                                                   .width *
//                                               0.7,
//                                         ),
//                                         child: Text(
//                                           data[index].message.toString(),
//                                           style: const TextStyle(
//                                               color: Colors.white),
//                                         ),
//                                       )),
//                                   Padding(
//                                     padding: const EdgeInsets.all(5.0),
//                                     child: CircleAvatar(
//                                       backgroundImage: NetworkImage(
//                                         data[0].userProfilePic.toString(),
//                                       ),
//                                     ),
//                                   ),
//                                 ],
//                               );
//                       },
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//             Align(
//               alignment: const AlignmentDirectional(-1, 1),
//               child: Container(
//                 padding: const EdgeInsetsDirectional.fromSTEB(30, 10, 30, 10),
//                 child: Row(
//                   mainAxisSize: MainAxisSize.max,
//                   mainAxisAlignment: MainAxisAlignment.end,
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Expanded(
//                       child: Container(
//                         decoration: BoxDecoration(
//                             color: Colors.grey.shade300.withOpacity(0.6),
//                             borderRadius:
//                                 const BorderRadius.all(Radius.circular(20))),
//                         // color: Colors.grey.shade400,
//                         width: double.infinity,
//                         child: TextFormField(
//                           autofocus: false,
//                           obscureText: false,
//                           decoration: const InputDecoration(
//                             border: InputBorder.none,
//                             hintText: 'Message...',
//                           ),
//                           textAlign: TextAlign.end,
//                         ),
//                       ),
//                     ),
//                     IconButton(
//                       icon: const Icon(
//                         Icons.send_rounded,
//                         color: Colors.blue,
//                         size: 30,
//                       ),
//                       onPressed: () {
//                         print('IconButton pressed ...');
//                       },
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class _TransitionListTile extends StatelessWidget {
//   const _TransitionListTile({
//     this.onTap,
//     required this.title,
//     required this.subtitle,
//   });

//   final GestureTapCallback? onTap;
//   final String title;
//   final String subtitle;

//   @override
//   Widget build(BuildContext context) {
//     return ListTile(
//       contentPadding: const EdgeInsets.symmetric(
//         horizontal: 15.0,
//       ),
//       leading: Container(
//         width: 40.0,
//         height: 40.0,
//         decoration: BoxDecoration(
//           borderRadius: BorderRadius.circular(20.0),
//           border: Border.all(
//             color: Colors.black54,
//           ),
//         ),
//         child: const Icon(
//           Icons.play_arrow,
//           size: 35,
//         ),
//       ),
//       onTap: onTap,
//       title: Text(title),
//       subtitle: Text(subtitle),
//     );
//   }
// }
