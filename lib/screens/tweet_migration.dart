import 'package:flutter/material.dart';
import 'package:foxxi/services/post_service.dart';

class TweetMigrationScreen extends StatelessWidget {
  TweetMigrationScreen({super.key});
  final PostService postService = PostService();
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
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
                      Icons.arrow_back_ios_new_rounded,
                      color: Colors.white,
                      // size: 15,
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                )),
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(
                "Tweets Migration",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(
                'You can import your 100 most recent tweets here.',
                style: TextStyle(
                  fontFamily: 'InstagramSans',
                  fontSize: 15,
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Stack(children: <Widget>[
                        Positioned.fill(
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(15),
                              gradient: LinearGradient(
                                colors: [
                                  Colors.lightBlue.shade100.withOpacity(0.4),
                                  Colors.purpleAccent.shade100.withOpacity(0.4),
                                ],
                                stops: const [0, 1],
                                begin: const AlignmentDirectional(1, 0),
                                end: const AlignmentDirectional(-1, 0),
                                // color: Colors.purpleAccent.shade100.withOpacity(
                                // 0.3,
                              ),
                            ),
                          ),
                        ),
                        TextButton(
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.all(16.0),
                            textStyle: const TextStyle(fontSize: 20),
                          ),
                          onPressed: () {
                            postService.importUserTweets(context: context);
                          },
                          child: const Text('Import'),
                        ),
                      ]),
                    ],
                  ),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
