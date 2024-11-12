#include <cs50.h>
#include <stdio.h>

int main(void)
{
    string answer = get_string("whats your name? ");
    char answer2 = get_char("really?(y/n) ");

    if (answer2 == 'n')
    {
        printf("thats alright\n");
    }
    int yes = get_int("what is your favorite number? ");


    if(yes > 0)
    {
        printf("hello, %s\n", answer);
    }

    if(yes == 7)
    {
        printf("NEVER say that number around me, the last 7 builds were AWEFUL\n");
    }

    if(yes == 3)
    {
        printf("I HATE your name, but I think we can work through this\n");
    }

    if(yes == 123)
    {
        printf("456\n");
    }

    if(yes == 0)
    {
        printf("I like 0... I like 0 a LOT\n");
    }

    int negative99 = (100 - yes);
    int positive99 =  (yes - 100);
    int nothing = 0;

    if(yes > 100)
    {
        nothing = get_int ("please subtract %d ",positive99);
    }

    if(yes < 100)
    {
        nothing = get_int("please add %d ",negative99);
    }
    if(nothing == 100)
    {
        printf("thank you\n");
    }
    if (nothing != 100)
    {
        printf("i dont like you\n");
    }
    if(yes < 0)
    {
        printf("please answer a positive number you JERK\n");
    }
    char answer3 = get_char("would you still love me if I was a worm? ");
    if(yes == 3)
    {
        string three = get_string("this is because I hate 3, isnt it? ");
        printf("alright\n");
    }
    if(yes == 123)
    {
        printf("789\n");
    }
    if(answer3 == 'n')
    {
printf("oh, ok\n");
    }
    if(answer3 == 'y')
    {
        printf("ok, WIERDO\n");
    }
string friendship = get_string("will you be my friend? ");
printf("ill take that as a yes\n");
string activity = get_string("what do you want to do now? ");
printf("sounds good, im gonna go now\n");
printf("end program\n");
}
