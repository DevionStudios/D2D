import 'package:flutter/material.dart';
import 'package:flutter/src/painting/gradient.dart' as gradient;
import 'package:foxxi/models/menu.dart';
import 'package:rive/rive.dart';

class SideMenuTile extends StatelessWidget {
  const SideMenuTile(
      {super.key,
      required this.menu,
      required this.press,
      required this.riveOnInit,
      required this.selectedMenu});
  final Menu menu;
  final VoidCallback press;
  final ValueChanged<Artboard> riveOnInit;
  final Menu selectedMenu;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      const Padding(
        padding: EdgeInsets.only(left: 24),
        child: Divider(
          color: Colors.white,
          height: 2,
        ),
      ),
      Stack(
        children: [
          AnimatedPositioned(
            duration: const Duration(milliseconds: 300),
            curve: Curves.fastOutSlowIn,
            width: selectedMenu == menu ? 288 : 0,
            height: 56,
            left: 0,
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(
                  width: 5,
                  color: Colors.purpleAccent.shade100.withOpacity(0.7),
                ),
                borderRadius: BorderRadius.all(Radius.circular(30)),
                // bottomRight: Radius.circular(30)),
                gradient: gradient.LinearGradient(
                  colors: [
                    Colors.lightBlue.shade100.withOpacity(0.4),
                    Colors.purpleAccent.shade100.withOpacity(0.4),
                  ],
                  stops: [0, 1],
                  begin: AlignmentDirectional(1, 0),
                  end: AlignmentDirectional(-1, 0),
                ),
              ),
            ),
          ),
          ListTile(
            onTap: press,
            leading: SizedBox(
              height: 36,
              width: 36,
              child: RiveAnimation.asset(
                menu.rive.src,
                artboard: menu.rive.artboard,
                onInit: riveOnInit,
              ),
            ),
            title: Text(
              menu.title,
              style: const TextStyle(color: Colors.black),
            ),
          ),
        ],
      )
    ]);
  }
}
