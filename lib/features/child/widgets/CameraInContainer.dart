import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';

class CameraInContainer extends StatefulWidget {
  const CameraInContainer({super.key, required this.Taskdetails});
  final TaskModel Taskdetails;

  @override
  State<CameraInContainer> createState() => _CameraInContainerState();
}

class _CameraInContainerState extends State<CameraInContainer> {
  final ImagePicker _picker = ImagePicker();
  File? _image;

  Future<void> takePicture() async {
    try {
      final XFile? pickedImage = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 70,
      );

      if (pickedImage == null) return;

      context.push(
        '/uploadimage',
        extra: {
          'task': widget.Taskdetails, // بدل 'Taskdetails'
          'image_path': pickedImage.path, // بدل 'imagePath'
        },
      );
    } catch (e) {
      debugPrint('Pick image error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          height: MediaQuery.of(context).size.height * 0.65,
          color: const Color(0xff3E3E3E),
          child: _image == null
              ? Center(
                  child: Icon(
                    Icons.camera_alt_outlined,
                    color: Colors.white,
                    size: 30.sp,
                  ),
                )
              : Image.file(_image!, fit: BoxFit.cover, width: double.infinity),
        ),
        SizedBox(height: 20.h),
        Custombutton(onPressed: takePicture, text: 'Take a photo'),
      ],
    );
  }
}
