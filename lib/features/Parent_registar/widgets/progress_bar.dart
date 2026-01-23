import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';

class AnimatedGradientProgress extends StatefulWidget {
  final double progress; // بين 0 و 1

  const AnimatedGradientProgress({super.key, required this.progress});

  @override
  State<AnimatedGradientProgress> createState() => _AnimatedGradientProgressState();
}

class _AnimatedGradientProgressState extends State<AnimatedGradientProgress>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  double _oldProgress = 0.0;

  static const double _minBar = 0.05; // اقل جزء يظهر في البداية

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _animation = Tween<double>(begin: 0.0, end: widget.progress).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _controller.forward();
  }

@override
void didUpdateWidget(covariant AnimatedGradientProgress oldWidget) {
  super.didUpdateWidget(oldWidget);

  if (widget.progress != oldWidget.progress) {
    _controller.reset();

    _animation = Tween<double>(
      begin: oldWidget.progress, 
      end: widget.progress,     
    ).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _controller.forward();
    _oldProgress = widget.progress; 
  }
}

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 8.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              
              final barValue = _animation.value <= 0 ? _minBar : _animation.value;

              return Container(
                height: MediaQuery.of(  context).size.height*0.026,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20.r),
                  color: Colors.grey.shade300,
                ),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: FractionallySizedBox(
                    widthFactor: barValue,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20.r),
                        gradient: const LinearGradient(
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                          colors: [
                            Color(0xffEFD8F3),
                            Color(0xffcD84DB),
                            Color(0xffcD84DB),
                          ],
                          stops: [0.0186, 0.5143, 1.0],
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),

          Align(
            alignment: Alignment.centerRight,
            child: Padding(
              padding: EdgeInsets.only(top: 4.h),
              child: AnimatedBuilder(
                animation: _animation,
                builder: (context, child) {
                  final percent = (_animation.value * 100).toInt();
                  final displayPercent = percent < 1 ? 0 : percent;

                  return CustomText(
                    text: "$displayPercent%",
                    iscenter: true,
                    size: 10.sp,
                    weight: FontWeight.w700,
                    color: const Color(0xffABABAB),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
