#include <iostream>
using namespace std;

int Sumofdigit(int n){
  int sum = 0;
  int remainder; 
  while(n>0){
    remainder = n%10;
    sum = sum+remainder;
    n = n/10;
  }
  return sum;
}

int main(){
  cout << Sumofdigit(12345) << endl;
   
  return 0;
}