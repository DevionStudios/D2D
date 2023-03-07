import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:foxxi/models/menu.dart';
import 'package:foxxi/utils/rive_utils.dart';
import 'package:flutter/src/painting/gradient.dart' as gradient;

import 'package:foxxi/widgets/side_menu_tile.dart';

class SideMenu extends StatefulWidget {
  const SideMenu({super.key});

  @override
  State<SideMenu> createState() => _SideMenuState();
}

class _SideMenuState extends State<SideMenu> {
  Menu selectedSideMenu = sidebarMenus.first;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: 288,
        height: double.infinity,
        // color: Colors.purpleAccent.shade100.withOpacity(0.65),
        decoration: BoxDecoration(
          // borderRadius: BorderRadius.only(
          //     bottomLeft: Radius.circular(30),
          //     bottomRight: Radius.circular(30)),
          gradient: gradient.LinearGradient(
            colors: [
              Colors.lightBlue.shade100.withOpacity(0.6),
              Colors.purpleAccent.shade100.withOpacity(0.4),
            ],
            stops: const [0, 1],
            begin: const AlignmentDirectional(1, 0),
            end: const AlignmentDirectional(-1, 0),
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.lightBlueAccent.shade100,
                  child: const Icon(
                    CupertinoIcons.person,
                    color: Colors.white,
                  ),
                ),
                title: Text(
                  'Kuntal Bar',
                  style: TextStyle(
                      color: Colors.grey.shade600, fontWeight: FontWeight.bold),
                ),
                subtitle: const Text(
                  '@Kuntal271',
                  style: TextStyle(color: Colors.black),
                ),
              ),
              Text(
                'Browse'.toUpperCase(),
                style: const TextStyle(fontSize: 20),
              ),
              ...sidebarMenus
                  .map((menu) => SideMenuTile(
                        menu: menu,
                        selectedMenu: selectedSideMenu,
                        press: () {
                          RiveUtils.changeSMIBoolState(menu.rive.status!);
                          setState(() {
                            selectedSideMenu = menu;
                          });
                        },
                        riveOnInit: (artboard) {
                          menu.rive.status = RiveUtils.getRiveInput(artboard,
                              stateMachineName: menu.rive.stateMachineName);
                        },
                      ))
                  .toList(),
            ],
          ),
        ),
      ),
    );
  }
}
