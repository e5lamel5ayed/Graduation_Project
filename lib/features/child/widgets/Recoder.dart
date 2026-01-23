import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:path_provider/path_provider.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';

class SimpleRecorder extends StatefulWidget {
  const SimpleRecorder({super.key, required this.Taskdetails});
  final TaskModel Taskdetails;

  @override
  State<SimpleRecorder> createState() => _SimpleRecorderState();
}

class _SimpleRecorderState extends State<SimpleRecorder>
    with SingleTickerProviderStateMixin {
  final FlutterSoundRecorder _recorder = FlutterSoundRecorder();
  final FlutterSoundPlayer _player = FlutterSoundPlayer();
  bool isRecorderReady = false;
  String? recordedFilePath;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    initRecorder();
    _player.openPlayer();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );

    _pulseAnimation = Tween<double>(begin: 0.9, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  Future<void> initRecorder() async {
    final status = await Permission.microphone.request();
    if (status != PermissionStatus.granted) {
      print("Permission denied!");
      return;
    }

    await _recorder.openRecorder();
    setState(() => isRecorderReady = true);
  }

  Future<void> startRecording() async {
    if (!isRecorderReady) return;

    Directory appDocDir = await getApplicationDocumentsDirectory();
    recordedFilePath =
        '${appDocDir.path}/record_${DateTime.now().millisecondsSinceEpoch}.aac';

    await _recorder.startRecorder(
      toFile: recordedFilePath,
      codec: Codec.aacADTS,
    );

    _pulseController.repeat(reverse: true);
    setState(() {});
  }

  Future<void> stopRecording() async {
    if (!_recorder.isRecording) return;

    final path = await _recorder.stopRecorder();

    if (path != null && File(path).existsSync()) {
      recordedFilePath = path;
    } else {
      recordedFilePath = null;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Recording failed, try again')),
      );
    }

    _pulseController.stop();
    setState(() {});
  }

  Future<void> playRecording() async {
    if (recordedFilePath == null || !File(recordedFilePath!).existsSync()) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('No recording found')));
      return;
    }

    _pulseController.stop();

    await _player.startPlayer(
      fromURI: recordedFilePath!,
      whenFinished: () {
        setState(() {});
      },
    );
  }

  Future<void> restartRecording() async {
    if (_recorder.isRecording) {
      await _recorder.stopRecorder();
    }

    _pulseController.stop();
    recordedFilePath = null;
    setState(() {});
  }

  void submitRecording() async {
    try {
      // لو التسجيل شغال، وقفوه وانتظري
      if (_recorder.isRecording) {
        await _recorder.stopRecorder();
      }

      // لو فيه player شغال، وقفوه وانتظري
      if (_player.isPlaying) {
        await _player.stopPlayer();
      }

      // اتأكدي من وجود الملف
      if (recordedFilePath == null || !File(recordedFilePath!).existsSync()) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please record audio first')),
        );
        return;
      }

      // الانتقال للصفحة التالية بعد التأكد من كل حاجة
      GoRouter.of(context).push(
        '/record_completed',
        extra: {"task": widget.Taskdetails, "audio_path": recordedFilePath},
      );
    } catch (e) {
      print("Error during submitRecording: $e");
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  @override
  void dispose() {
    _recorder.closeRecorder();
    _player.closePlayer();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            GestureDetector(
              onTap: restartRecording,
              child: Container(
                padding: EdgeInsets.all(4.w),
                width: 50.w,
                height: 50.h,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.descColor, width: 1.w),
                  color: AppColors.Background,
                ),
                child: Center(
                  child: SvgPicture.asset('assets/icons/restart.svg'),
                ),
              ),
            ),
            SizedBox(width: 20.w),
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _recorder.isRecording ? _pulseAnimation.value : 1,
                  child: child,
                );
              },
              child: GestureDetector(
                onTap: () async {
                  if (_recorder.isRecording) {
                    await stopRecording();
                  } else {
                    await startRecording();
                  }
                },
                child: Container(
                  width: 80.w,
                  height: 80.h,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Color(0xffC8AED7), Color(0xffC08ADD)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Center(
                    child: SvgPicture.asset('assets/icons/microphone.svg'),
                  ),
                ),
              ),
            ),
            SizedBox(width: 20.w),
            GestureDetector(
              onTap: playRecording,
              child: Container(
                width: 50.w,
                height: 50.h,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.descColor, width: 1.w),
                  color: AppColors.Background,
                ),
                child: const Center(
                  child: Icon(Icons.play_arrow, color: Color(0xff9CA3AF)),
                ),
              ),
            ),
          ],
        ),

        Spacer(),
        Custombutton(text: "Submit Audio", onPressed: submitRecording),
      ],
    );
  }
}
