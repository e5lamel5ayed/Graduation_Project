import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_sound/public/flutter_sound_player.dart';
import 'package:flutter_sound/public/flutter_sound_recorder.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/child/cubit/progress_cubit.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/widgets/Recoder.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';

class RecordTaskView extends StatefulWidget {
  final TaskModel Taskdetails;

  const RecordTaskView({
    super.key,
    required this.Taskdetails,
  });

  @override
  State<RecordTaskView> createState() => _RecordTaskViewState();
}

class _RecordTaskViewState extends State<RecordTaskView> {
  final FlutterSoundRecorder recorder = FlutterSoundRecorder();
  final FlutterSoundPlayer player = FlutterSoundPlayer();
  bool isRecorderInitialized = false;

  String? recordedFilePath;

  @override
  void initState() {
    super.initState();
    initRecorder();
    player.openPlayer();
  }

  Future initRecorder() async {
    await recorder.openRecorder();
    setState(() => isRecorderInitialized = true);
  }

  Future<String?> stopRecordingIfNeeded() async {
    if (recorder.isRecording || recorder.isPaused) {
      final path = await recorder.stopRecorder();
      setState(() => recordedFilePath = path);
      return path;
    }
    return recordedFilePath;
  }

  @override
  void dispose() {
    recorder.closeRecorder();
    player.closePlayer();
    super.dispose();
  }

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
                  Popbutton(
                    onPressed: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/home_child');
                      }
                    },
                  ),
                  SizedBox(width: 70.w),
          Expanded(
              child: CustomText(
                text:widget.Taskdetails.TaskTitle , iscenter: true,size: 20.sp,color: AppColors.titleColor,weight: FontWeight.w600,),
            )
                ],
              ),

              SizedBox(height: 25.h),

              HomeAppbar(),
              SizedBox(height: 180.h),

              Expanded(
                child: SimpleRecorder(Taskdetails: widget.Taskdetails,),
              ),
            


            /*  Custombutton(
                text: 'Submit',
                onPressed: () async {
                  final filePath = await stopRecordingIfNeeded();

                  context.read<ProgressCubit>().completeTask(
                        widget.Taskdetails.point,
                      );

                  GoRouter.of(context).push(
                    '/record_completed',
                    extra: {
                      "task": widget.Taskdetails,
                      "audio_path": filePath,
                    },
                  );
                },
              ),*/
            ],
          ),
        ),
      ),
    );
  }
}
