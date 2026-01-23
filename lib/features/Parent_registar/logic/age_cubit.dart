import 'package:flutter_bloc/flutter_bloc.dart';

part 'age_state.dart';

class AgeCubit extends Cubit<AgeState> {
  AgeCubit() : super(const AgeState(progress: 0.6)); // يبدأ progress 60%

  void selectAge(int age) {
    emit(state.copyWith(selectedAge: age, progress: 0.8)); // بعد الاختيار يزيد progress
  }
}
