import 'package:flutter/material.dart';
import 'package:foxxi/routing_constants.dart';
import 'package:foxxi/services/user_service.dart';
import 'package:foxxi/widgets/textfield_widget_2.dart';

class AirDropScreen extends StatelessWidget {
  static const String routeName = airdropScreenRoute;
  AirDropScreen({super.key});
  final TextEditingController _emailTextController = TextEditingController();
  final TextEditingController _walletAddressTextController =
      TextEditingController();
  final TextEditingController _messageTextController = TextEditingController();
  final UserService userService = UserService();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'AirDrop',
            style: TextStyle(fontSize: 50),
          ),
          const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text(
                'Send us your Email Address, Wallet Address and a Optional Message to receive your free tokens'),
          ),
          TextFieldWidget2(
            controller: _emailTextController,
            headingText: 'Email Address',
          ),
          TextFieldWidget2(
              controller: _walletAddressTextController,
              headingText: 'Wallet Address'),
          TextFieldWidget2(
              controller: _messageTextController, headingText: 'Message'),
          const SizedBox(height: 20),
          ElevatedButton(
              onPressed: () {
                userService.requestAirdrop(
                    context: context,
                    email: _emailTextController.text,
                    walletAddress: _walletAddressTextController.text,
                    message: _messageTextController.text);
              },
              child: const Text('Send Email'))
        ],
      ),
    );
  }
}
