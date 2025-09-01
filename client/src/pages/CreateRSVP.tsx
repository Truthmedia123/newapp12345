import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Heart, Upload, X, Download, MessageCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

const createRSVPSchema = z.object({
  brideName: z.string().min(1, "Bride name is required"),
  groomName: z.string().min(1, "Groom name is required"),
  weddingDate: z.string().min(1, "Wedding date is required"),
  nuptialsTime: z.string().min(1, "Nuptials time is required"),
  receptionTime: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  venueAddress: z.string().min(1, "Venue address is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  contactPhone2: z.string().optional(),
  story: z.string().optional(),
  coverImage: z.string().optional(),
  maxGuests: z.string().min(1).transform((val) => parseInt(val) || 100),
  rsvpDeadline: z.string().optional(),
});

type CreateRSVPForm = z.infer<typeof createRSVPSchema>;

export default function CreateRSVP() {
  const [createdWedding, setCreatedWedding] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateRSVPForm>({
    resolver: zodResolver(createRSVPSchema),
    defaultValues: {
      brideName: "",
      groomName: "",
      weddingDate: "",
      nuptialsTime: "",
      receptionTime: "",
      venue: "",
      venueAddress: "",
      contactEmail: "",
      contactPhone: "",
      contactPhone2: "",
      story: "",
      coverImage: "",
      maxGuests: 100,
      rsvpDeadline: "",
    },
  });

  const createWeddingMutation = useMutation({
    mutationFn: async (data: CreateRSVPForm) => {
      const response = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create wedding");
      return response.json();
    },
    onSuccess: (wedding) => {
      setCreatedWedding(wedding);
      toast({
        title: "Success!",
        description: "Your wedding RSVP page has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/weddings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create wedding RSVP page. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateRSVPForm) => {
    createWeddingMutation.mutate(data);
  };

  if (createdWedding) {
    const rsvpUrl = `${window.location.origin}/rsvp/${createdWedding.slug}`;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <Heart className="h-8 w-8" />
                RSVP Page Created Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {createdWedding.brideName} & {createdWedding.groomName}
                </h3>
                <p className="text-gray-600 mb-6">Your wedding RSVP page is ready to share!</p>
              </div>

              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <QRCodeSVG value={rsvpUrl} size={200} />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">Share this link:</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={rsvpUrl} readOnly className="font-mono text-sm" />
                  <Button
                    onClick={() => navigator.clipboard.writeText(rsvpUrl)}
                    variant="outline"
                    size="sm"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href={`/rsvp/${createdWedding.slug}`}>
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                    <Heart className="h-4 w-4 mr-2" />
                    View RSVP Page
                  </Button>
                </Link>
                <Link href={`/track-rsvp/${createdWedding.slug}`}>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Track Responses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Heart className="h-8 w-8" />
              Create Your Wedding RSVP
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brideName">Bride's Name *</Label>
                  <Input
                    id="brideName"
                    {...form.register("brideName")}
                    placeholder="Enter bride's name"
                  />
                  {form.formState.errors.brideName && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.brideName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="groomName">Groom's Name *</Label>
                  <Input
                    id="groomName"
                    {...form.register("groomName")}
                    placeholder="Enter groom's name"
                  />
                  {form.formState.errors.groomName && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.groomName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weddingDate">Wedding Date *</Label>
                  <Input
                    id="weddingDate"
                    type="date"
                    {...form.register("weddingDate")}
                  />
                  {form.formState.errors.weddingDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.weddingDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="nuptialsTime">Nuptials Time *</Label>
                  <Input
                    id="nuptialsTime"
                    type="time"
                    {...form.register("nuptialsTime")}
                  />
                  {form.formState.errors.nuptialsTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.nuptialsTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  {...form.register("venue")}
                  placeholder="Wedding venue name"
                />
                {form.formState.errors.venue && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.venue.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="venueAddress">Venue Address *</Label>
                <Textarea
                  id="venueAddress"
                  {...form.register("venueAddress")}
                  placeholder="Full venue address"
                  rows={2}
                />
                {form.formState.errors.venueAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.venueAddress.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...form.register("contactEmail")}
                  placeholder="your.email@example.com"
                />
                {form.formState.errors.contactEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="story">Your Love Story (Optional)</Label>
                <Textarea
                  id="story"
                  {...form.register("story")}
                  placeholder="Share your love story with your guests..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={createWeddingMutation.isPending}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 text-lg"
              >
                {createWeddingMutation.isPending ? "Creating..." : "Create RSVP Page"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}