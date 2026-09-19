import ProtectedRoute from "@/app/components/ProtectedRoute";
import { HabitForm } from "@/app/components/forms/habitForm";

export default function CreateHabitPage() {
  return (
    <ProtectedRoute>
      <HabitForm />
    </ProtectedRoute>
  );
}
