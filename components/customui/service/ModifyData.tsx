"use client";
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@uidotdev/usehooks";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataApiObjectType } from "./data";
import { ModifyData } from "@/actions/serviceModule/server";

const formSchema = z.object({
  name: z.string({
    required_error: "Name field is required.",
  }),
  amount: z.number({
    required_error: "Amount field is required.",
  }),
  status: z.string({
    required_error: "Status field is required.",
  }),
  discount: z.string({
    required_error: "Discount field is required.",
  }),
  server: z.string({
    required_error: "Server field is required.",
  }),
  network_code: z.string({
    required_error: "Network Code field is required.",
  }),
  price: z.string({
    required_error: "Price field is required.",
  })
})

interface profileFormPropType{
  id:number,
  modalCloseTrigger :React.MutableRefObject<any>,
  data:DataApiObjectType
}

type ModifyPropType={
  id:number,
  data:DataApiObjectType
}

export function ModifyDatamodal({
    id,
    data
}:ModifyPropType) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("only screen and (min-width: 768px)");
  const modalCloseTrigger = React.useRef(null);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outline">Modify</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Modify Data</DialogTitle>
            <DialogDescription>
                {/* Edit user's informations. */}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[50vh] w-full overflow-y-auto p-2">
            <ProfileForm 
              id={id}
              modalCloseTrigger={modalCloseTrigger}
              data={data}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="secondary"
                ref={modalCloseTrigger}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Modify</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white p-4">
        <DrawerHeader className="text-left">
          <DrawerTitle>Modify Data</DrawerTitle>
          <DrawerDescription>
            {/* Edit user's informations. */}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] w-full">
            <ProfileForm 
              id={id}
              modalCloseTrigger={modalCloseTrigger}
              data={data}
            />
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" ref={modalCloseTrigger}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ 
  id,
  modalCloseTrigger,
  data
}:profileFormPropType) {

    const[isLoading, setIsLoading]=useState<boolean>(false);
    const {toast} = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          status: data?.status === 1?"1":"0",
          discount:(data?.discount!==null)?data?.discount:"null",
          server:(data?.server!==null)?data?.server:"null",
          name:(data?.name!==null)?data?.name:"null",
          amount:data?.amount,
          network_code:(data?.network_code!==null)?data?.network_code:"null",
          price:(data?.price!==null)?data?.price:"null"
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const {
            name,
            status,
            discount,
            amount,
            server,
            price,
            network_code
        }=values;
        setIsLoading(true)
        ModifyData(
            id,
            status==="0"?0:1,
            name,
            amount,
            price,
            network_code,
            discount,
            server
        ).then((response)=>{
            const{
                message,
            }=response;
            setIsLoading(false)
            if(modalCloseTrigger.current){
              modalCloseTrigger.current?.click();
            }
            toast({
                description:message
            })
        }).catch((error)=>{
            setIsLoading(false)
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description:`${error}`
            })
            return{
                errorMessage:error,
            }
          })
      }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                      <Input placeholder="name" {...field} type="text"/>
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                      <Input placeholder="amount" {...field} type="text"/>
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Modify Airtime Status" />
                    </SelectTrigger>
                    <SelectContent
                        className="bg-white"
                    >
                        <SelectItem value="1">Enable</SelectItem>
                        <SelectItem value="0">Disable</SelectItem>
                    </SelectContent>
                </Select>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                      <Input placeholder="discount" {...field} type="text"/>
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="server"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Server</FormLabel>
                  <FormControl>
                      <Input placeholder="server" {...field} type="string"/>
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="network_code"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Network Code</FormLabel>
                  <FormControl>
                      <Input placeholder=" network code" {...field} type="string"/>
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                      <Input placeholder="price" {...field} type="string"/>
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <div className="flex justify-end items-end">
                {
                    isLoading?
                        <Button type="submit" disabled className="text-white w-full text-center bg-black" >Sending request...</Button>:
                        <Button type="submit" className="text-white w-full text-center bg-black" >Submit</Button>
                }
            </div>
        </form>
    </Form>
  )
}