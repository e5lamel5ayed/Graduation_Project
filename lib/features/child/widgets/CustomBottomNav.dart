import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:liquid_glass_renderer/liquid_glass_renderer.dart';
import 'package:rewarding_kids/features/child/widgets/glasscontainer.dart';
import 'package:rewarding_kids/features/child/widgets/Navicon.dart';
import 'package:rewarding_kids/features/child/views/Home_child_view.dart';
import 'package:rewarding_kids/features/child/views/GiftScreen.dart';
import 'package:rewarding_kids/features/child/views/MedalScreen.dart';

class CustomBottomNav extends StatefulWidget {
  const CustomBottomNav({super.key});

  @override
  State<CustomBottomNav> createState() => _CustomBottomNavState();
}

class _CustomBottomNavState extends State<CustomBottomNav> {
  int currentIndex = 0;
  final List<Widget> screens = [HomeChildView(), Giftscreen(), Medalscreen()];

  @override
  Widget build(BuildContext context) {
    return 
    Scaffold(
        body: Stack(
          children: [
            // الخلفية
           /* Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xff6A5AE0), Color(0xff9C89FF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),*/

            // الشاشة الحالية
            screens[currentIndex],

            // BottomNav
      Align(
  alignment: Alignment.bottomCenter,
  child: Padding(
    padding: EdgeInsets.only(bottom: 20.h),
    child: GlassContainer(
      width: MediaQuery.of(context).size.width * 0.65,
      height: MediaQuery.of(context).size.height * 0.075,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          NavIcon(
            path: "assets/child/homenavigate.svg",
            index: 0,
            currentIndex: currentIndex,
            onTap: () => setState(() => currentIndex = 0),
          ),
          NavIcon(
            path: "assets/child/giftnavigate.svg",
            index: 1,
            currentIndex: currentIndex,
            onTap: () => setState(() => currentIndex = 1),
          ),
          NavIcon(
            path: "assets/child/medalnavigate.svg",
            index: 2,
            currentIndex: currentIndex,
            onTap: () => setState(() => currentIndex = 2),
          ),
        ],
      ),
    ),
  ),
),

          ],
        ),
      
    );
  }
}
