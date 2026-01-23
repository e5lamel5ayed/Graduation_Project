import 'package:flutter_bloc/flutter_bloc.dart';
import 'progress_state.dart';

class ProgressCubit extends Cubit<ProgressState> {
  ProgressCubit()
      : super(const ProgressState(
    totalPoints: 0,
    goalPoints: 200,
    showCelebration: false,// غيري الرقم لو عايزة
  ));

  void addPoints(int value) {
    emit(state.copyWith(totalPoints: state.totalPoints + value));
  }

  void completeTask(int rewardPoints) {
    // زوّد النقاط
    addPoints(rewardPoints);

    // اعرض الاحتفال
    emit(state.copyWith(showCelebration: true));

    // اخفيه بعد ثانيتين
    Future.delayed(Duration(seconds: 2), () {
      emit(state.copyWith(showCelebration: false));
    });
  }
  void emitShowCelebration() {
    emit(state.copyWith(showCelebration: true));
    Future.delayed(const Duration(seconds: 2), () {
      emit(state.copyWith(showCelebration: false));
    });
  }

}