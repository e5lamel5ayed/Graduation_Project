import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Applebutton extends StatelessWidget {
  const Applebutton({super.key, required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height:MediaQuery.of(context).size.height*0.053,
      // height: 50.h,
      child: OutlinedButton(
          style: OutlinedButton.styleFrom(
            foregroundColor:AppColors.Background ,
            side:  BorderSide(color: AppColors.ActiveColor,width: 1.w),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.r),
            ),
          ),
          onPressed: () {
            // context.go('/login');
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                  width:28.w,height:28.h,
                  child: SvgPicture.asset('assets/icons/apple.svg',fit:BoxFit.contain,))
              ,SizedBox(width:MediaQuery.of(context).size.width*0.012,)
              ,CustomText(text: text, iscenter: true,color: AppColors.titleColor,size: 14.sp,weight: FontWeight.w500),
            ],
          )
      ),
    );
  }
}

