import 'package:flutter/material.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/features/child/widgets/GiftsTabs.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';
class Giftscreen extends StatelessWidget {
  const Giftscreen({super.key});

  @override
  Widget build(BuildContext context) {
    return
 Scaffold(
    backgroundColor: AppColors.Background,
    body: SafeArea(
    child: Padding(
    padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 16.h),
    child: Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
    HomeAppbar(),
    SizedBox(height: 10.h),
    Expanded(child: GiftsTabs())
    
    ]))));
  }
}
