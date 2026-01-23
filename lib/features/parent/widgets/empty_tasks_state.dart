import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';

class EmptyTasksState extends StatelessWidget {
  const EmptyTasksState({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:  EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
      child: Container(
        width: double.infinity,
        height: MediaQuery.of(context).size.height * 0.2,
      //  margin: const EdgeInsets.only(top: 16),
        
        decoration: BoxDecoration(
          color: Color(0xffF8F4FA),
          borderRadius: BorderRadius.circular(16.r),
        ),
        child:  Center(
          child: CustomText(text: 'No tasks match the search', iscenter: true,color: Color(0xff9CA3AF),size: 12.sp,weight: FontWeight.w400,),
        ),
      ),
    );
  }
}
