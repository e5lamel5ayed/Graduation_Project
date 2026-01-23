import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class AddtaskAppar extends StatelessWidget {
  const AddtaskAppar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: MediaQuery.of(context).size.height * 0.1,
      decoration: BoxDecoration(
        color: Color(0xffF8F4FA),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.25),
            spreadRadius: 0,
            blurRadius: 20,
            offset: Offset(0, 4), // changes position of shadow
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 8.h),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Popbutton(
              onPressed: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go('/Layout');
                }
              },
            ),
            Spacer(),

            Center(
              child: CustomText(
                text: 'Add  New Task',
                iscenter: true,
                color: AppColors.titleColor,
                size: 18.sp,
                weight: FontWeight.w500,
              ),
            ),
            Spacer(),
          ],
        ),
      ),
    );
  }
}
