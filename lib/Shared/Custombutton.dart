import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Custombutton extends StatelessWidget {
  const Custombutton({super.key, required this.onPressed, required this.text});
  final VoidCallback? onPressed;
  final String text;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      
    height: MediaQuery.of(context).size.height*0.053 ,
    
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.ActiveColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
          ),
        ),
        onPressed: onPressed,
        child: CustomText(
          text: text,
          iscenter: true,
          color: Colors.white,
          size: 14.sp,
        ),
      ),
    );
  }
}
