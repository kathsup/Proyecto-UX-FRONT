import ProtectedRoute from "@/app/components/ProtectedRoute";
import { HabitForm } from "@/app/components/forms/HabitForm";

export default function CreateHabitPage() {
  return (
    <ProtectedRoute>
      <HabitForm />
    </ProtectedRoute>
  );
}
