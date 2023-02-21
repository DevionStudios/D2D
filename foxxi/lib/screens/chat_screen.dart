// import 'package:flutter/material.dart';
// import 'package:foxxi/screens/chat.dart';
// import 'package:foxxi/widgets/comment_card.dart';
// import 'package:foxxi/widgets/quick_chat.dart';
// import '../screens/profile_screen.dart';
// import '../widgets/card.dart';
// import '../widgets/story_bar.dart';

// class Chat extends StatelessWidget {
//   const Chat({super.key});

//   // This widget is the root of your application.
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Flutter Demo',
//       theme: ThemeData(
//         primarySwatch: Colors.blue,
//       ),
//       home: Scaffold(
//         body: Container(
//           padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
//           width: double.infinity,
//           height: double.infinity,
//           decoration: BoxDecoration(
//             gradient: LinearGradient(
//               colors: [
//                 Colors.lightBlue.shade100.withOpacity(0.4),
//                 Colors.purpleAccent.shade100.withOpacity(0.4),
//               ],
//               stops: const [0, 1],
//               begin: const AlignmentDirectional(1, 0),
//               end: const AlignmentDirectional(-1, 0),
//               // color: Colors.purpleAccent.shade100.withOpacity(
//               // 0.3,
//             ),
//           ),
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               ListTile(
//                 trailing: const CircleAvatar(
//                   radius: 30,
//                   // borderRadius: BorderRadius.circular(8),
//                   backgroundImage: NetworkImage(
//                       "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/D64OUNCBGBMJDE7PYTDAYDDKB4.jpg"),
//                 ),
//                 leading: Column(
//                   mainAxisAlignment: MainAxisAlignment.start,
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: const [
//                     Text(
//                       'Konnichiwa',
//                       style: TextStyle(
//                         color: Colors.black38,
//                         fontSize: 15,
//                         fontFamily: 'Unbounded',
//                       ),
//                       textAlign: TextAlign.right,
//                     ),
//                     Text(
//                       'Kuntal271',
//                       style: TextStyle(
//                         fontFamily: 'Unbounded',
//                         color: Colors.black38,
//                         fontWeight: FontWeight.bold,
//                         fontSize: 25,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//               StoryBar(
//                 key: key,
//               ),
//               ChatScreen(
//                 userName: 'Kuntal271',
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
