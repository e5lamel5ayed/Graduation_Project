import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
class Forgetbutton extends StatelessWidget {
  const Forgetbutton({super.key});

  @override
  Widget build(BuildContext context) {
    return  Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        GestureDetector(
          onTap: (){context.go('/forgetpass');},
          child: Text(
            'Forgot password?',
            style: TextStyle(
                decoration: TextDecoration.underline,
                //decorationColor: AppColors.titleColor,
                decorationThickness: 1,
                color:  AppColors.titleColor,
                fontSize: 12.sp,
                fontWeight: FontWeight.w500
            ),
          ),
        ),
      ],
    );
  }
}
