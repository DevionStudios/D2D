import 'package:flutter/material.dart';
import 'package:foxxi/models/news.dart';

// ignore: use_key_in_widget_constructors
class NewsCard extends StatelessWidget {
  String? title;
  String? description;
  String? photo;
  NewsCard({this.title, this.description, this.photo});
  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.12,
      width: MediaQuery.of(context).size.height * 0.12,
      child: Stack(
        children: [
          GestureDetector(
            onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => OneFullNewsPage(
                    title: title,
                    description: description,
                    photo: photo,
                  ),
                )),
            child: Hero(
              tag: 'test-$photo',
              child: Container(
                width: MediaQuery.of(context).size.width - 20,
                height: MediaQuery.of(context).size.height,
                decoration: BoxDecoration(
                  image: DecorationImage(
                      filterQuality: FilterQuality.low,
                      image: NetworkImage(photo.toString()),
                      fit: BoxFit.cover,
                      colorFilter: ColorFilter.mode(
                          Colors.lightBlue.withOpacity(0.4), BlendMode.darken)),
                  borderRadius: const BorderRadius.all(Radius.circular(30)),
                  border: Border.all(
                      color: Colors.grey.shade100.withOpacity(0.4), width: 5),
                ),
              ),
            ),
          ),
          Container(
            height: MediaQuery.of(context).size.height * 0.2,
            width: MediaQuery.of(context).size.width - 20,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Hero(
                  tag: 'test-$title',
                  child: Material(
                    type: MaterialType.transparency,
                    child: Container(
                      padding: EdgeInsets.all(8),
                      child: Text(
                        title.toString(),
                        maxLines: 2,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            backgroundColor:
                                Colors.grey.shade100.withOpacity(0.2),
                            color: Colors.white,
                            fontSize: 15,
                            fontFamily: 'Unbounded',
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
                Hero(
                  tag: 'test-$description',
                  child: Material(
                    type: MaterialType.transparency,
                    child: Container(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        description.toString(),
                        textAlign: TextAlign.center,
                        maxLines: 4,
                        style: const TextStyle(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}

class OneFullNewsPage extends StatelessWidget {
  String? title;
  String? description;
  String? photo;
  OneFullNewsPage({this.title, this.description, this.photo});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          width: MediaQuery.of(context).size.width - 20,
          height: MediaQuery.of(context).size.height - 20,
          decoration: const BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.all(Radius.circular(8))),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Padding(
                padding: EdgeInsets.all(20.0),
                child: Hero(
                  tag: 'test-$title',
                  child: Material(
                    type: MaterialType.transparency,
                    child: Text(
                      title.toString(),
                      maxLines: 2,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          backgroundColor:
                              Colors.grey.shade100.withOpacity(0.2),
                          color: Colors.white,
                          fontSize: 15,
                          fontFamily: 'Unbounded',
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
              Hero(
                  tag: 'test-$photo',
                  child: Image.network(photo.toString(),
                      width: 500, fit: BoxFit.cover)),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Hero(
                  tag: 'test-$description',
                  child: Material(
                    type: MaterialType.transparency,
                    child: Text(
                      description.toString(),
                      textAlign: TextAlign.center,
                      maxLines: 4,
                      style: const TextStyle(
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// class PhotoHero extends StatelessWidget {
//   PhotoHero({super.key, required this.photo, this.onTap, this.width});

//   String photo;
//   VoidCallback? onTap;
//   double? width;

//   Widget build(BuildContext context) {
//     return SizedBox(
//       width: width,
//       child: Hero(
//         tag: photo,
//         child: Material(
//           color: Colors.transparent,
//           child: InkWell(
//             onTap: onTap,
//             child: Image.network(
//               photo.toString(),
//               fit: BoxFit.contain,
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }
