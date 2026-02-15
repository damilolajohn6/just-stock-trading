'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Rating } from '@/components/shared/rating';

interface ProductTabsProps {
  description: string | null;
  material: string | null;
  condition: string;
  reviews?: {
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    user_name: string;
    created_at: string;
  }[];
}

export function ProductTabs({
  description,
  material,
  condition,
  reviews = [],
}: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews ({reviews.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-sm max-w-none">
          {description ? (
            <p>{description}</p>
          ) : (
            <p className="text-muted-foreground">No description available.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="details" className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Condition
            </dt>
            <dd className="mt-1 capitalize">{condition.replace('_', ' ')}</dd>
          </div>
          {material && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Material
              </dt>
              <dd className="mt-1">{material}</dd>
            </div>
          )}
        </dl>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.user_name}</p>
                    <Rating value={review.rating} size="sm" />
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </time>
                </div>
                {review.title && (
                  <h4 className="font-medium mb-1">{review.title}</h4>
                )}
                {review.content && (
                  <p className="text-sm text-muted-foreground">
                    {review.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
