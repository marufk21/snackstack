"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

interface SubscriptionEndedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isTrial?: boolean;
  remainingDays?: number;
  expiryDate?: Date;
}

export function SubscriptionEndedDialog({
  open,
  onOpenChange,
  isTrial = false,
  remainingDays = 0,
  expiryDate,
}: SubscriptionEndedDialogProps) {
  const isExpired = remainingDays <= 0;
  const title = isTrial
    ? isExpired
      ? "Free Trial Ended"
      : "Free Trial Ending Soon"
    : isExpired
    ? "Subscription Ended"
    : "Subscription Ending Soon";

  const description = isTrial
    ? isExpired
      ? "Your 14-day free trial has ended. Upgrade to a paid plan to continue using SnackStack."
      : `Your free trial will end in ${remainingDays} day${remainingDays !== 1 ? "s" : ""}. Upgrade now to keep all your features.`
    : isExpired
    ? "Your subscription has ended. Renew your subscription to continue using premium features."
    : `Your subscription will end in ${remainingDays} day${remainingDays !== 1 ? "s" : ""}. Renew now to avoid losing access.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {isExpired ? (
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            )}
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {expiryDate && !isExpired && (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isTrial ? "Trial" : "Subscription"} ends on{" "}
              <span className="font-semibold text-foreground">
                {expiryDate.toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Link href="/app/pricing" className="w-full sm:w-auto">
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
              {isTrial ? "Upgrade Now" : "Renew Subscription"}
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
