import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/child/cubit/progress_cubit.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/widgets/coin.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
class DoTaskView extends StatelessWidget {
  const DoTaskView({super.key, required this.Taskdetails});

  final TaskModel Taskdetails;

  @override
  Widget build(BuildContext context) {
    return Scaffold(

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
                                context.go('/task_view');
                              }
                            }),
                
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
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Expanded(
                                        child: CustomText(
                                          text:" complete it carefully and have fun while doing it!\nWhen you’re done, tap “I’m Done!\”"
                                        , iscenter: true,size: 14.sp,color: AppColors.descColor,weight: FontWeight.w400,),
                                      ),
                                      SvgPicture.asset('assets/icons/speaker.svg',width: 16.w,height: 16.h,)
                                    ],
                                  ),
                                  Spacer(),
                                //  SizedBox(height: 50.h,),
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
                          context.read<ProgressCubit>().completeTask(Taskdetails.point);

                          GoRouter.of(context).push('/task_completed',
                              extra:Taskdetails,
                          );},
                          text: 'I\'m Done!')

                      ],
                    )
                )
            )
        );
    }
}


