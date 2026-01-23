import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/parent/data/task_model.dart';
import 'package:rewarding_kids/features/parent/widgets/helpers/task_status_helper.dart';
class TaskCard extends StatelessWidget {
  final TaskModel task;

  const TaskCard({super.key, required this.task});

  @override
  Widget build(BuildContext context) {
    final color = taskStatusColor(task.status);

    return Container(
  width: MediaQuery.of(context).size.width * 0.9,

      margin:  EdgeInsets.only(bottom: 16.h),
      padding:  EdgeInsets.symmetric(horizontal: 16.w,vertical: 16.h),
      decoration: BoxDecoration(
        color: Color(0xffF8F4FA),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: color),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
        Row(
          children: [
            CustomText( text: task.title, iscenter: true,
            size: 16.sp,
            color: AppColors.titleColor,
            weight: FontWeight.w500,
            ),
            const Spacer(),
          Container(width: 24.w, height: 24.h, 
          child: SvgPicture.asset( taskStatusIcon(task.status),color: color,),),
          ],
        )
        ,   SizedBox(height: 6.h),
          CustomText( text:"Listen to a short story without interrupting.", iscenter: true,
        size: 12.sp,
        color: AppColors.descColor,
        weight: FontWeight.w400,
        )
        , 
         SizedBox(height: 6.h),
          Row(
           mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
 mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: MediaQuery.of(context).size.width * 0.2,
                  //  height: MediaQuery.of(context).size.height * 0.03,
                    decoration: BoxDecoration(
                      color:Color(0xffE4E4E4) ,
                      borderRadius: BorderRadius.circular(8.r),
                    ),
                    child:   CustomText( text: task.category, iscenter: true,
                              size: 14.sp,
                              color:Color(0xff60697B),
                              weight: FontWeight.w400,
                              ),
                  ),
                  SizedBox(width: 6.w),
                      Container(
                    width: MediaQuery.of(context).size.width * 0.2,
                  //  height: MediaQuery.of(context).size.height * 0.03,
                    decoration: BoxDecoration(
                      color:Color(0xffE4E4E4) ,
                      borderRadius: BorderRadius.circular(8.r),
                    ),
                    child:   CustomText( text: task.level, iscenter: true,
                              size: 14.sp,
                              color:Color(0xff60697B),
                              weight: FontWeight.w400,
                              ),),
                ],
              ),
              
              // SizedBox(height: 6.h),
              Row(
               mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                  
              width:30.w,
               height:20.h,
                          //padding: EdgeInsets.all(4.w),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                  
                          ),
                          child: Image.asset('assets/child/coins.png')),
                              SizedBox(
                width:30.w,
            height: 20.h,
              
                child:   CustomText( text: "${task.rewardPoints}", iscenter: true,
            size: 14.sp,
            color:Color(0xff394A59),
            weight: FontWeight.w500,
            ),
              ),
                ],
              )
            
            ],
          ),
       SizedBox(height: 6.h),
        ],
      ),
    );
  }
}

