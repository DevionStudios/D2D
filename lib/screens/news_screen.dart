import 'dart:convert' as convert;
// import 'dart:js_util';
import 'package:http/http.dart' as http;

import 'package:flutter/material.dart';
import 'package:foxxi/models/news.dart';
import 'package:foxxi/widgets/news_card.dart';
import 'package:swipeable_card_stack/swipeable_card_stack.dart';

import '../models/news.dart';
// void _getData(String? query) async {
//     _news = (await ApiService().getNews(query));
//     Future.delayed(const Duration(seconds: 5)).then((value) => setState(() {}));
//   }

class NewsScreen extends StatefulWidget {
  SwipeableCardSectionController cardController =
      SwipeableCardSectionController();

  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

// Future<void> testing() async {
//   var queryParameters = {
//     'q': 'Tesla',
//   };
//   var headers = {'x-api-key': 'fwoKTG51ZvcZrGlaZYinW4Nhdp36YUQLfFibRMCwuI4'};
//   var url = Uri.https('api.newscatcherapi.com', '/v2/search', queryParameters);
//   var response = await http.get(url, headers: headers);

//   if (response.statusCode == 200) {
//     final jsonResponse = convert.jsonDecode(response.body);
//     print('$jsonResponse');
//   } else {
//     print('Reponse error with code ${response.statusCode}');
//   }
// }

class ApiService {
  Future<News?> getNews(String? query) async {
    var queryParameters = {
      'q': query,
      'lang': 'en',
    };
    var headers = {'x-api-key': 'Qr-e4e9cpr5K1bg25afqiADBQJ_OUCa78bLElzqsipI'};
    var url =
        Uri.https('api.newscatcherapi.com', '/v2/search', queryParameters);
    var response = await http.get(url, headers: headers);

    if (response.statusCode == 200) {
      News? news = newsFromJson(response.body);

      return news;
    } else {
      print('Reponse error with code ${response.statusCode}');
    }
  }
}

class _NewsScreenState extends State<NewsScreen> {
  String? query = 'all';
  late Future<News?> _news;
  final myController = TextEditingController();

  void didChangeDependencies() {
    super.didChangeDependencies();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _news = ApiService().getNews(query);
  }

  @override
  Widget build(BuildContext context) {
    final myController = TextEditingController();
    return Scaffold(
      body: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.fromRGBO(0, 169, 191, 1),
              Colors.greenAccent,
            ],
          ),
        ),
        child: FutureBuilder<News?>(
          future: _news,
          builder: ((context, snapshot) {
            if (snapshot.hasData) {
              return Row(
                children: [
                  SwipeableCardsSection(
                    cardController: widget.cardController,
                    context: context,
                    items: [
                      NewsCard(
                        title: snapshot.data!.articles[0].title,
                        photo: snapshot.data!.articles[0].media,
                        description: snapshot.data!.articles[0].summary,
                      ),
                      NewsCard(
                        title: snapshot.data!.articles[1].title,
                        photo: snapshot.data!.articles[1].media,
                        description: snapshot.data!.articles[1].summary,
                      ),
                      NewsCard(
                        title: snapshot.data!.articles[2].title,
                        photo: snapshot.data!.articles[2].media,
                        description: snapshot.data!.articles[2].summary,
                      ),
                    ],
                    onCardSwiped: (dir, index, wid) {
                      widget.cardController.addItem(
                        NewsCard(
                          title: snapshot.data!.articles[index + 3].title,
                          photo: snapshot.data!.articles[index + 3].media,
                          description:
                              snapshot.data!.articles[index + 3].summary,
                        ),
                      );
                    },
                    enableSwipeUp: true,
                    enableSwipeDown: true,
                  ),
                ],
              );
            } else if (snapshot.hasError) {
              return Text('${snapshot.error}');
            }
            return const Center(
              child: SizedBox(
                  width: 20, height: 20, child: CircularProgressIndicator()),
            );
          }),
        ),
      ),
    );
  }
}
