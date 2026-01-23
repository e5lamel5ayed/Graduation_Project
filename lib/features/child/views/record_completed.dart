import 'dart:io';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:rewarding_kids/features/child/widgets/RecordedVoiceBubble.dart';
import 'package:voice_message_package/voice_message_package.dart';

import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/child/cubit/progress_cubit.dart';
import 'package:rewarding_kids/features/child/cubit/progress_state.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/widgets/AudioWaveformWidget.dart';
import 'package:rewarding_kids/features/child/widgets/WaveformPlayerWidge.dart';
import 'package:rewarding_kids/features/child/widgets/celebration.dart';
import 'package:rewarding_kids/features/child/widgets/coin.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class RecordCompletedView extends StatefulWidget {
  final TaskModel Taskdetails;
  final String audioPath;

  const RecordCompletedView({
    Key? key,
    required this.Taskdetails,
    required this.audioPath,
  }) : super(key: key);

  @override
  State<RecordCompletedView> createState() => _RecordCompletedViewState();
}

class _RecordCompletedViewState extends State<RecordCompletedView> {
  @override
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
      await _audioPlayer.play(AssetSource('sounds/celebration_sound.mp3'));
    } catch (e) {
      print("Audio error: $e");
    }
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: BlocBuilder<ProgressCubit, ProgressState>(
          builder: (context, state) {
            return Stack(
              alignment: Alignment.center,
              children: [
                CelebrationGIF(show: _showCelebration),
                Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: 16.w,
                    vertical: 16.h,
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Popbutton(
                            onPressed: () => context.canPop()
                                ? context.pop()
                                : context.go('/home_child'),
                          ),
                          SizedBox(width: 70.w),
                          Expanded(
                            child: CustomText(
                              text: widget.Taskdetails.TaskTitle,
                              iscenter: true,
                              size: 20.sp,
                              color: AppColors.titleColor,
                              weight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 25.h),

                      HomeAppbar(),
                      SizedBox(height: 150.h),
                      RecordedVoiceBubble(audioPath: widget.audioPath),

                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Expanded(
                            child: CustomText(
                              text: "You said all the days perfectly.",
                              iscenter: true,
                              size: 20.sp,
                              color: AppColors.titleColor,
                              weight: FontWeight.w400,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 50.h),
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
                        ],
                      ),

                      Spacer(),

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
                        text: 'Great',
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
