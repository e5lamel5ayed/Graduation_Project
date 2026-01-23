import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/child/cubit/progress_cubit.dart';
import 'package:rewarding_kids/features/child/cubit/progress_state.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/widgets/celebration.dart';
import 'package:rewarding_kids/features/child/widgets/coin.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class TaskCompletedView extends StatefulWidget {
  const TaskCompletedView({super.key, required this.taskDetails});
  final TaskModel taskDetails;

  @override
  State<TaskCompletedView> createState() => _TaskCompletedViewState();
}

class _TaskCompletedViewState extends State<TaskCompletedView> {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _showCelebration = true;

  @override
  void initState() {
    super.initState();

    // تحميل الـ GIF
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        precacheImage(
          const AssetImage('assets/animations/celebration_animation.gif'),
          context,
        );
      }
    });

    _startCelebration();
  }

  Future<void> _startCelebration() async {
    try {
      await _audioPlayer.play(
        AssetSource('sounds/celebration_sound.mp3'),
      );
    } catch (e) {
      print("Audio error: $e");
    }
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: BlocBuilder<ProgressCubit, ProgressState>(
          builder: (context, state) {
            return Stack(
              alignment: Alignment.center,
              children: [
                /// 🎉 الـ GIF يظهر طول ما showCelebration = true
                 CelebrationGIF(show:_showCelebration ),

                /// الصفحة الأساسية
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Popbutton(onPressed: () {
                            if (context.canPop()) {
                              context.pop();
                            } else {
                              context.go('/do_task');
                            }
                          }),
                        
                          Expanded(
                            child: Center(
                              child: CustomText(
                                text: widget.taskDetails.TaskTitle,
                                iscenter: true,
                                size: 20.sp,
                                color: AppColors.titleColor,
                                weight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 25.h),
                      HomeAppbar(),
                      SizedBox(height: 30.h),

                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 13.h),
                        child: SizedBox(
                          width: double.infinity,
                          height: 375.h,
                          child: 
                          Column(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(15.r),
                                child: SizedBox(
                                  width: 278.w,
                                  height: 210.h,
                                  child: Image.asset(
                                    widget.taskDetails.image,
                                    fit: BoxFit.fill,
                                  ),
                                ),
                              ),
                              SizedBox(height: 30.h),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Expanded(
                                    child: CustomText(
                                      text: "Great Job! Task Completed!👏",
                                      iscenter: true,
                                      size: 20.sp,
                                      color: AppColors.descColor,
                                      weight: FontWeight.w400,
                                    ),
                                  ),
                                  SvgPicture.asset(
                                    'assets/icons/speaker.svg',
                                    width: 16.w,
                                    height: 16.h,
                                  ),
                                ],
                              ),
                          Spacer(),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  CustomText(
                                    text: 'Reward:',
                                    iscenter: true,
                                    size: 18.sp,
                                    weight: FontWeight.w500,
                                    color: AppColors.titleColor,
                                  ),
                                  SizedBox(width: 10.h),
                                  const Coin(),
                                  CustomText(
                                    text: '${widget.taskDetails.point}',
                                    iscenter: true,
                                    size: 18.sp,
                                    weight: FontWeight.w500,
                                    color: AppColors.titleColor,
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
              Spacer(),

                      /// زر الذهاب للصفحة التالية
                      Custombutton(
                        onPressed: () {
                          // وقف الصوت
                          _audioPlayer.stop();

                          // اخفاء الجيف
                          setState(() {
                            _showCelebration = false;
                          });

                          // الانتقال
                          context.go('/Custombottomnav');
                        },
                        text: 'Next Task',
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}  