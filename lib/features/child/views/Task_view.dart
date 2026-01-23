import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/widgets/coin.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
class TaskView extends StatelessWidget {
  const TaskView({super.key, required this.Taskdetails});
  final TaskModel Taskdetails;

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
        backgroundColor: AppColors.Background,
        body: SafeArea(
        child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
    child: Column(
      children: [
        Row(
          children: [
            Popbutton(onPressed: (){
              if(context.canPop()){
                context.pop();
              }else{
                context.go('/home_child');
              }
            }),
      //Spacer(),
            Expanded(
              child: Center(
                child: CustomText(
                  text:Taskdetails.TaskTitle , iscenter: true,size: 20.sp,color: AppColors.titleColor,weight: FontWeight.w600,),
              ),
            )
          ],
        ),
        SizedBox(height: 25.h,),
        HomeAppbar(),
        SizedBox(height: 30.h,),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 13.h),
          child: SizedBox(width: double.infinity,height: 375.h,
          child:Column(
              children: [
                Padding(
                  padding:  EdgeInsets.symmetric(vertical: 8.h,
                  ),
                  child: ClipRRect(
                    borderRadius:BorderRadius.circular(15.r),
                    child: Container(
                      width: 278.w,
                      height: 210.h,

                      child: Image.asset(Taskdetails.image,fit: BoxFit.fill,),
                    ),
                  ),
                ),
                SizedBox(height: 30.h,),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Expanded(
                        child: CustomText(
                          text:"Make a craft Learn by creating — every craft \nteaches something new!", iscenter: true,size: 14.sp,color: AppColors.descColor,weight: FontWeight.w400,),
                      ),
                      SvgPicture.asset('assets/icons/speaker.svg',width: 16.w,height: 16.h,)
                    ],
                  ),
                ),
  Spacer(),
                  SizedBox(
                  width: 129.w,
                  height: 27.h,
                  child: Row(
                    children: [
                      CustomText(text: 'Reward:', iscenter: true,size: 18.sp,weight: FontWeight.w500,color: AppColors.titleColor,) ,
                      SizedBox(width: 10.h,),
                      Coin(),
                      CustomText(text: '${Taskdetails.point}', iscenter: true,size: 18.sp,weight: FontWeight.w500,color: AppColors.titleColor,) ,


                    ],
                  ),
                ),

              ],

            )

          ),

        ),
  Spacer(),
        Custombutton(onPressed:(){
    GoRouter.of(context).push('/do_task',  extra:TaskModel(TaskTitle: Taskdetails.TaskTitle, image: Taskdetails.image, point: Taskdetails.point, TaskDesc: Taskdetails.TaskDesc, issound: Taskdetails.issound, isimage: Taskdetails.isimage));
    }, text: 'Start')

      ],
    )
        )
        )
    );
  }
}
