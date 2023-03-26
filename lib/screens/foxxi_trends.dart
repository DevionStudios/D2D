import 'package:flutter/material.dart';
import 'package:foxxi/models/foxxi_trends_post_model.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/services/post_service.dart';
import 'package:foxxi/widgets/foxxi_trends_card.dart';
import 'dart:developer' as dev;

class FoxxiTrendScreen extends StatefulWidget {
  const FoxxiTrendScreen({super.key});
  static const String routeName = foxxiTrendsScreenRoute;
  @override
  State<FoxxiTrendScreen> createState() => _FoxxiTrendScreenState();
}

class _FoxxiTrendScreenState extends State<FoxxiTrendScreen> {
  Future<List<FoxxiTrendsPost>>? postList;
  PostService postService = PostService();
  @override
  void initState() {
    super.initState();
    postList = postService.getTwitterTrends(context: context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          FutureBuilder<List<FoxxiTrendsPost>?>(
            future: postList,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                dev.log(snapshot.data!.toString(), name: 'Snapshot Data');
                return Expanded(
                  child: ListView.builder(
                      scrollDirection: Axis.vertical,
                      itemCount: snapshot.data?.length == null
                          ? 0
                          : snapshot.data!.length,
                      itemBuilder: (context, index) => FoxxiTrendCard(
                          caption: snapshot.data![index].text,
                          createdAt: snapshot.data![index].created_at)),
                );
              } else {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}
