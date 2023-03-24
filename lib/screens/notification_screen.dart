import 'package:flutter/material.dart';
import 'package:foxxi/models/notification.dart';
import 'package:foxxi/providers/theme_provider.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/screens/chat_screen.dart';
import 'package:foxxi/services/notification_service.dart';
import 'package:provider/provider.dart';

class NotificationScreen extends StatefulWidget {
  static const String routeName = notificationScreenRoute;
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  late Future<List<NotificationModel>>? _notificationList;
  NotificationService notificationService = NotificationService();

  @override
  void initState() {
    super.initState();
    _notificationList = notificationService.getNotification(context: context);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context, listen: true).isDarkMode;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification'),
        actions: [
          IconButton(
              onPressed: () {
                notificationService.deleteNotification(context: context);
              },
              icon: const Icon(Icons.delete_rounded))
        ],
      ),
      body: FutureBuilder<List<NotificationModel>>(
        future: _notificationList,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            var notificationData = snapshot.data!;
            return ListView.builder(
              itemCount: snapshot.data?.length ?? 0,
              itemBuilder: (context, index) => GestureDetector(
                onTap: () {
                  if (notificationData[index].notificationType == 'MESSAGE') {
                    Navigator.push(context,
                        MaterialPageRoute(builder: (context) => const Chat()));
                  }

                  if (notificationData[index].postId != null) {}
                },
                child: ListTile(
                  title: Text(
                    '${notificationData[index].username} ${notificationData[index].notification} ${notificationData[index].notificationType}',
                    style:
                        TextStyle(color: isDark ? Colors.white : Colors.black),
                  ),
                ),
              ),
            );
            // ignore: prefer_is_empty
          } else if (snapshot.data == null) {
            return Center(
                child: Text(
              'No Notifications Yet!',
              style: TextStyle(color: isDark ? Colors.white : Colors.black),
            ));
          } else {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
        },
      ),
    );
  }
}
