import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DeleteSuperhog() {
  return (
    <Card className="m-12">
      <CardHeader className="my-5 text-3xl font-bold text-primary">
        Delete Superhog verification
      </CardHeader>
      <CardContent>
        <p>TODO: Implement Superhog verification form</p>
        <div className="font-semi text-center text-xl">
          Enter Echo token of form to delete
        </div>
      </CardContent>
    </Card>
  );
}
